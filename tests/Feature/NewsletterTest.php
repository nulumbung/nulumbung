<?php

use App\Enums\NewsletterStatus;
use App\Mail\NewsletterMail;
use App\Models\Category;
use App\Models\News;
use App\Models\NewsletterSubscriber;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
});

function newsletterManager(): User
{
    $user = User::factory()->create();
    $user->givePermissionTo('manage-newsletter');

    return $user;
}

test('a visitor can subscribe to the newsletter from the public form', function () {
    $this->post(route('newsletter.subscribe'), [
        'email' => 'reader@example.com',
        'name' => 'Reader',
    ])->assertRedirect(route('newsletter.show'));

    $subscriber = NewsletterSubscriber::where('email', 'reader@example.com')->first();

    expect($subscriber)->not->toBeNull()
        ->and($subscriber->status)->toBe(NewsletterStatus::Subscribed)
        ->and($subscriber->subscribed_at)->not->toBeNull();
});

test('subscribing again keeps a single subscribed record', function () {
    $this->post(route('newsletter.subscribe'), ['email' => 'reader@example.com']);
    $this->post(route('newsletter.subscribe'), ['email' => 'reader@example.com']);

    $subscriber = NewsletterSubscriber::where('email', 'reader@example.com')->first();

    expect(NewsletterSubscriber::where('email', 'reader@example.com')->count())->toBe(1)
        ->and($subscriber->status)->toBe(NewsletterStatus::Subscribed);
});

test('a subscriber can unsubscribe with their personal token', function () {
    $subscriber = NewsletterSubscriber::factory()->create();

    $this->get(route('newsletter.unsubscribe', ['token' => $subscriber->token]))
        ->assertRedirect(route('newsletter.show'));

    expect($subscriber->refresh()->status)->toBe(NewsletterStatus::Unsubscribed)
        ->and($subscriber->unsubscribed_at)->not->toBeNull();
});

test('newsletter management requires authentication', function () {
    $this->get(route('management.newsletter.index'))
        ->assertRedirect(route('login'));
});

test('newsletter management requires the manage-newsletter permission', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('management.newsletter.index'))
        ->assertForbidden();
});

test('the newsletter index shows subscribers and newsletter news', function () {
    $manager = newsletterManager();
    NewsletterSubscriber::factory()->create();
    $news = News::factory()->create(['is_newsletter' => true, 'status' => 'publish']);

    $this->actingAs($manager)
        ->get(route('management.newsletter.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/newsletter/index')
            ->where('subscribed_count', 1)
            ->where('subscribers.total', 1)
            ->where('newsletter_news', fn ($items) => count($items) === 1 && $items[0]['id'] === $news->id));
});

test('a published newsletter news is delivered automatically to subscribers', function () {
    Mail::fake();
    $category = Category::factory()->create();
    $subscriber = NewsletterSubscriber::factory()->create();
    $superadmin = User::factory()->create();
    $superadmin->assignRole('superadmin');

    $this->actingAs($superadmin)
        ->post(route('management.news.store'), [
            'title' => 'Berita Newsletter Otomatis',
            'category_id' => $category->id,
            'publish_at' => '2026-09-24 10:00:00',
            'status' => 'publish',
            'is_newsletter' => true,
        ])
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    $news = News::where('title', 'Berita Newsletter Otomatis')->firstOrFail();

    Mail::assertSent(NewsletterMail::class, 1);
    Mail::assertSent(NewsletterMail::class, fn (NewsletterMail $mail) => $mail->hasTo($subscriber->email));
    expect($news->newsletter_sent_at)->not->toBeNull();
});

test('a draft newsletter news is not delivered automatically', function () {
    Mail::fake();
    $category = Category::factory()->create();
    NewsletterSubscriber::factory()->create();
    $superadmin = User::factory()->create();
    $superadmin->assignRole('superadmin');

    $this->actingAs($superadmin)
        ->post(route('management.news.store'), [
            'title' => 'Berita Newsletter Draf',
            'category_id' => $category->id,
            'publish_at' => '2026-09-24 10:00:00',
            'status' => 'draft',
            'is_newsletter' => true,
        ])
        ->assertRedirect();

    $news = News::where('title', 'Berita Newsletter Draf')->firstOrFail();

    Mail::assertNotSent(NewsletterMail::class);
    expect($news->newsletter_sent_at)->toBeNull();
});

test('a published non-newsletter news is not delivered automatically', function () {
    Mail::fake();
    $category = Category::factory()->create();
    NewsletterSubscriber::factory()->create();
    $superadmin = User::factory()->create();
    $superadmin->assignRole('superadmin');

    $this->actingAs($superadmin)
        ->post(route('management.news.store'), [
            'title' => 'Berita Biasa',
            'category_id' => $category->id,
            'publish_at' => '2026-09-24 10:00:00',
            'status' => 'publish',
        ])
        ->assertRedirect();

    Mail::assertNotSent(NewsletterMail::class);
});

test('an already delivered newsletter is not sent again on update', function () {
    Mail::fake();
    NewsletterSubscriber::factory()->create();
    $news = News::factory()->create([
        'is_newsletter' => true,
        'status' => 'publish',
        'newsletter_sent_at' => now(),
    ]);
    $superadmin = User::factory()->create();
    $superadmin->assignRole('superadmin');

    $this->actingAs($superadmin)
        ->patch(route('management.news.update', $news), [
            'title' => $news->title,
            'category_id' => $news->category_id,
            'publish_at' => '2026-09-20 10:00:00',
            'status' => 'publish',
        ])
        ->assertRedirect();

    Mail::assertNotSent(NewsletterMail::class);
    expect($news->refresh()->newsletter_sent_at)->not->toBeNull();
});

test('a newsletter can be sent manually to subscribed subscribers only', function () {
    Mail::fake();
    $manager = newsletterManager();
    $subscribed = NewsletterSubscriber::factory()->create();
    $unsubscribed = NewsletterSubscriber::factory()->unsubscribed()->create();
    $news = News::factory()->create(['is_newsletter' => true]);

    $this->actingAs($manager)
        ->post(route('management.newsletter.send', $news))
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    Mail::assertSent(NewsletterMail::class, 1);
    Mail::assertNotSent(NewsletterMail::class, fn (NewsletterMail $mail) => $mail->hasTo($unsubscribed->email));
    expect($news->refresh()->newsletter_sent_at)->not->toBeNull();
});

test('a news not marked as a newsletter cannot be sent manually', function () {
    $manager = newsletterManager();
    $news = News::factory()->create(['is_newsletter' => false]);

    $this->actingAs($manager)
        ->post(route('management.newsletter.send', $news))
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'error');

    expect($news->refresh()->newsletter_sent_at)->toBeNull();
});

test('sending a newsletter without subscribers is reported', function () {
    Mail::fake();
    $manager = newsletterManager();
    $news = News::factory()->create(['is_newsletter' => true]);

    $this->actingAs($manager)
        ->post(route('management.newsletter.send', $news))
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'error');

    expect($news->refresh()->newsletter_sent_at)->toBeNull();
});
