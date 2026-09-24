<?php

use App\Models\Category;
use App\Models\News;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Ramsey\Uuid\Uuid;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
});

function newsManager(): User
{
    $user = User::factory()->create();
    $user->assignRole('superadmin');

    return $user;
}

function newsPayload(array $overrides = []): array
{
    return array_merge([
        'title' => 'Industri Manufaktur Tumbuh 8 Persen',
        'image' => 'news/foto.jpg',
        'image_caption' => 'Ilustrasi industri',
        'description' => '<p>Perkembangan industri manufaktur menunjukkan tren positif.</p>',
        'category_id' => Category::factory()->create()->id,
        'publish_at' => '2026-09-18 08:00:00',
        'status' => 'publish',
    ], $overrides);
}

test('news page requires authentication', function () {
    $this->get(route('management.news.index'))
        ->assertRedirect(route('login'));
});

test('news page requires the manage-news permission', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('management.news.index'))
        ->assertForbidden();
});

test('news page is displayed with the category options', function () {
    $user = newsManager();
    Category::factory()->create(['name' => 'Ekonomi']);

    $this->actingAs($user)
        ->get(route('management.news.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/news/index')
            ->where('filters.search', '')
            ->where('timezone', config('app.timezone'))
            ->where('categories', fn ($value) => collect($value)->where('name', 'Ekonomi')->isNotEmpty()));
});

test('the news create page is displayed', function () {
    $this->actingAs(newsManager())
        ->get(route('management.news.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/news/create')
            ->where('timezone', config('app.timezone')));
});

test('the news show page is displayed with the news article', function () {
    $news = News::factory()->create(['title' => 'Kejuaraan Bulutangkis Asia']);

    $this->actingAs(newsManager())
        ->get(route('management.news.show', $news))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/news/show')
            ->where('news.id', $news->id)
            ->where('news.title', 'Kejuaraan Bulutangkis Asia'));
});

test('the news edit page is displayed with the news article', function () {
    $news = News::factory()->create(['title' => 'Kejuaraan Bulutangkis Asia']);

    $this->actingAs(newsManager())
        ->get(route('management.news.edit', $news))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/news/edit')
            ->where('news.id', $news->id)
            ->where('timezone', config('app.timezone')));
});

test('news articles are paginated ten per page', function () {
    $user = newsManager();
    News::factory()->count(11)->create();

    $this->actingAs($user)
        ->get(route('management.news.index'))
        ->assertInertia(fn ($page) => $page
            ->where('news.total', 11)
            ->where('news.per_page', 10)
            ->where('news.last_page', 2)
            ->where('news.data', fn ($data) => count($data) === 10));
});

test('news articles can be searched by title', function () {
    $user = newsManager();
    $news = News::factory()->create(['title' => 'Kejuaraan Bulutangkis Asia']);

    $this->actingAs($user)
        ->get(route('management.news.index', ['search' => 'bulutangkis']))
        ->assertInertia(fn ($page) => $page
            ->where('filters.search', 'bulutangkis')
            ->where('news.total', 1)
            ->where('news.data', fn ($data) => ($data[0]['id'] ?? null) === $news->id));
});

test('news articles can be filtered by status', function () {
    $user = newsManager();
    $published = News::factory()->create(['status' => 'publish']);
    $draft = News::factory()->create(['status' => 'draft']);

    $this->actingAs($user)
        ->get(route('management.news.index', ['status' => 'draft']))
        ->assertInertia(fn ($page) => $page
            ->where('filters.status', 'draft')
            ->where('news.total', 1)
            ->where('news.data', fn ($data) => ($data[0]['id'] ?? null) === $draft->id));

    $this->actingAs($user)
        ->get(route('management.news.index', ['status' => 'publish']))
        ->assertInertia(fn ($page) => $page
            ->where('news.total', 1)
            ->where('news.data', fn ($data) => ($data[0]['id'] ?? null) === $published->id));
});

test('an unknown status filter is ignored', function () {
    $user = newsManager();
    News::factory()->count(3)->create();

    $this->actingAs($user)
        ->get(route('management.news.index', ['status' => 'trash']))
        ->assertInertia(fn ($page) => $page->where('news.total', 3));
});

test('publish date is serialized with a timezone offset', function () {
    $user = newsManager();
    News::factory()->create(['publish_at' => '2026-09-18 08:00:00']);

    $this->actingAs($user)
        ->get(route('management.news.index'))
        ->assertInertia(fn ($page) => $page
            ->where('news.data', fn ($data) => ($data[0]['publish_at'] ?? null) === '2026-09-18T08:00:00.000000Z'));
});

test('a news article uses a uuid primary key derived from its title', function () {
    $category = Category::factory()->create();
    $user = newsManager();

    $this->actingAs($user)
        ->post(route('management.news.store'), newsPayload([
            'category_id' => $category->id,
        ]))
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    $news = News::first();
    $slug = Str::slug($news->title);
    $expectedId = Uuid::uuid5('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', $slug)->toString();

    expect($news)->not->toBeNull()
        ->and($news->id)->toBe($expectedId)
        ->and($news->slug)->toBe($slug);
});

test('a duplicate title gets a unique slug', function () {
    $user = newsManager();

    $this->actingAs($user)->post(route('management.news.store'), newsPayload());
    $this->actingAs($user)->post(route('management.news.store'), newsPayload());

    expect(News::where('slug', 'industri-manufaktur-tumbuh-8-persen')->exists())->toBeTrue()
        ->and(News::where('slug', 'industri-manufaktur-tumbuh-8-persen-2')->exists())->toBeTrue();
});

test('a custom slug is accepted and stored', function () {
    $user = newsManager();
    $category = Category::factory()->create();

    $this->actingAs($user)
        ->post(route('management.news.store'), newsPayload([
            'category_id' => $category->id,
            'slug' => 'perkembangan-ekonomi',
        ]))
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    $news = News::first();
    $expectedId = Uuid::uuid5('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', 'perkembangan-ekonomi')->toString();

    expect($news->slug)->toBe('perkembangan-ekonomi')
        ->and($news->id)->toBe($expectedId);
});

test('updating a news article keeps its slug when the title is unchanged', function () {
    $user = newsManager();
    $news = News::factory()->create();

    $this->actingAs($user)
        ->patch(route('management.news.update', $news), [
            'title' => $news->title,
            'category_id' => $news->category_id,
            'publish_at' => '2026-09-19 10:30:00',
            'status' => 'publish',
        ])
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    expect($news->refresh()->slug)->toBe($news->slug);
});

test('the main image caption is stored', function () {
    $user = newsManager();

    $this->actingAs($user)
        ->post(route('management.news.store'), newsPayload([
            'image_caption' => 'Keterangan utama',
        ]))
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    expect(News::first()->image_caption)->toBe('Keterangan utama');
});

test('the main image caption is returned with the news article', function () {
    $user = newsManager();
    $news = News::factory()->create(['image_caption' => 'Keterangan foto utama']);

    $this->actingAs($user)
        ->get(route('management.news.index'))
        ->assertInertia(fn ($page) => $page
            ->where('news.data', fn ($data) => ($data[0]['image_caption'] ?? null) === 'Keterangan foto utama'));
});

test('updating the title updates the auto generated slug', function () {
    $user = newsManager();
    $news = News::factory()->create();

    $this->actingAs($user)
        ->patch(route('management.news.update', $news), [
            'title' => 'Judul Baru Berita',
            'category_id' => $news->category_id,
            'publish_at' => '2026-09-19 10:30:00',
            'status' => 'publish',
        ])
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    expect($news->refresh()->slug)->toBe('judul-baru-berita');
});

test('the publisher is filled automatically from the creator roles', function () {
    $user = newsManager();

    $this->actingAs($user)
        ->post(route('management.news.store'), newsPayload())
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    expect(News::first()->publisher)->toBe('superadmin');
});

test('placement flags are stored when provided', function () {
    $user = newsManager();

    $this->actingAs($user)
        ->post(route('management.news.store'), newsPayload([
            'is_headline' => true,
            'is_trending' => true,
            'is_newsletter' => true,
        ]))
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    $news = News::first();
    expect($news->is_headline)->toBeTrue()
        ->and($news->is_trending)->toBeTrue()
        ->and($news->is_newsletter)->toBeTrue()
        ->and($news->is_popular)->toBeFalse();
});

test('a news title is required', function () {
    $this->actingAs(newsManager())
        ->post(route('management.news.store'), newsPayload(['title' => '']))
        ->assertSessionHasErrors(['title']);
});

test('a news category is required and must exist', function () {
    $this->actingAs(newsManager())
        ->post(route('management.news.store'), newsPayload(['category_id' => '']))
        ->assertSessionHasErrors(['category_id']);

    $this->actingAs(newsManager())
        ->post(route('management.news.store'), newsPayload([
            'category_id' => '00000000-0000-0000-0000-000000000000',
        ]))
        ->assertSessionHasErrors(['category_id']);
});

test('a news status must be a valid status', function () {
    $this->actingAs(newsManager())
        ->post(route('management.news.store'), newsPayload(['status' => 'trash']))
        ->assertSessionHasErrors(['status']);
});

test('a news article can be updated', function () {
    $user = newsManager();
    $news = News::factory()->create();
    $category = Category::factory()->create();

    $this->actingAs($user)
        ->patch(route('management.news.update', $news), [
            'title' => 'Industri Pariwisata Membaik',
            'category_id' => $category->id,
            'publish_at' => '2026-09-19 10:30:00',
            'status' => 'archive',
            'is_headline' => true,
        ])
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    $news->refresh();
    expect($news->title)->toBe('Industri Pariwisata Membaik')
        ->and($news->slug)->toBe('industri-pariwisata-membaik')
        ->and($news->category_id)->toBe($category->id)
        ->and($news->status->value)->toBe('archive')
        ->and($news->is_headline)->toBeTrue()
        ->and($news->publisher)->toBe('superadmin');
});

test('an image can be uploaded for the news editor', function () {
    Storage::fake('public');
    $user = newsManager();

    $response = $this->actingAs($user)
        ->post(route('management.news.upload-image'), [
            'image' => UploadedFile::fake()->image('foto.jpg'),
        ])
        ->assertOk()
        ->assertJsonStructure(['path']);

    Storage::disk('public')->assertExists($response->json('path'));
});

test('the news image upload requires a valid image file', function () {
    $this->actingAs(newsManager())
        ->post(route('management.news.upload-image'), [])
        ->assertSessionHasErrors(['image']);
});

test('a news article can be deleted', function () {
    $user = newsManager();
    $news = News::factory()->create();
    $from = route('management.news.index');

    $this->actingAs($user)
        ->from($from)
        ->delete(route('management.news.destroy', $news))
        ->assertRedirect($from)
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    expect(News::find($news->id))->toBeNull();
});
