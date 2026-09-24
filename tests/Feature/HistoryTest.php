<?php

use App\Models\History;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
});

function historyManager(): User
{
    $user = User::factory()->create();
    $user->assignRole('superadmin');

    return $user;
}

test('history page requires authentication', function () {
    $this->get(route('management.history.index'))
        ->assertRedirect(route('login'));
});

test('history page requires the manage-history permission', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('management.history.index'))
        ->assertForbidden();
});

test('history page is displayed', function () {
    $this->actingAs(historyManager())
        ->get(route('management.history.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/history/index')
            ->where('filters.search', ''));
});

test('history create page is displayed', function () {
    $this->actingAs(historyManager())
        ->get(route('management.history.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/history/create'));
});

test('history show page is displayed', function () {
    $history = History::factory()->create();

    $this->actingAs(historyManager())
        ->get(route('management.history.show', $history))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/history/show')
            ->where('history.id', $history->id));
});

test('history edit page is displayed', function () {
    $history = History::factory()->create();

    $this->actingAs(historyManager())
        ->get(route('management.history.edit', $history))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/history/edit')
            ->where('history.id', $history->id));
});

test('history items are paginated ten per page', function () {
    History::factory()->count(11)->create();

    $this->actingAs(historyManager())
        ->get(route('management.history.index'))
        ->assertInertia(fn ($page) => $page
            ->where('histories.total', 11)
            ->where('histories.per_page', 10)
            ->where('histories.last_page', 2)
            ->where('histories.data', fn ($data) => count($data) === 10));
});

test('history items can be searched', function () {
    $item = History::factory()->create(['title' => 'Sejarah Berdirinya NU']);

    $this->actingAs(historyManager())
        ->get(route('management.history.index', ['search' => 'berdiri']))
        ->assertInertia(fn ($page) => $page
            ->where('filters.search', 'berdiri')
            ->where('histories.total', 1)
            ->where('histories.data', fn ($data) => ($data[0]['id'] ?? null) === $item->id));
});

test('a history entry uses a uuid primary key', function () {
    $history = History::factory()->create();

    expect(Str::isUuid($history->id))->toBeTrue();
});

test('a history entry exposes its image url', function () {
    $history = History::factory()->create(['image' => 'history/sejarah.jpg']);

    expect($history->image_url)->toEndWith('/storage/history/sejarah.jpg');
});

test('a history entry can be created', function () {
    $this->actingAs(historyManager())
        ->post(route('management.history.store'), [
            'title' => 'Sejarah Berdirinya NU',
            'year' => '1945',
            'image' => 'history/sejarah.jpg',
            'description' => '<p>Latar belakang berdirinya NU.</p>',
            'sort_order' => 3,
        ])
        ->assertRedirect(route('management.history.edit', History::where('title', 'Sejarah Berdirinya NU')->first()))
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    $history = History::where('title', 'Sejarah Berdirinya NU')->first();
    expect($history)->not->toBeNull()
        ->and($history->year)->toBe('1945')
        ->and($history->sort_order)->toBe(3);
});

test('a history title is required', function () {
    $this->actingAs(historyManager())
        ->post(route('management.history.store'), [
            'year' => '1945',
        ])
        ->assertSessionHasErrors(['title']);
});

test('a history entry can be updated', function () {
    $history = History::factory()->create(['title' => 'Lama']);

    $this->actingAs(historyManager())
        ->from(route('management.history.index'))
        ->patch(route('management.history.update', $history), [
            'title' => 'Baru',
            'year' => '1999',
        ])
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    expect($history->refresh()->title)->toBe('Baru')
        ->and($history->year)->toBe('1999');
});

test('a history entry can be deleted', function () {
    $history = History::factory()->create();

    $this->actingAs(historyManager())
        ->from(route('management.history.index'))
        ->delete(route('management.history.destroy', $history))
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    expect(History::find($history->id))->toBeNull();
});

test('a history image can be uploaded', function () {
    Storage::fake('public');

    $response = $this->actingAs(historyManager())
        ->post(route('management.history.upload-image'), [
            'image' => UploadedFile::fake()->image('sejarah.jpg', 800, 450),
        ]);

    $response->assertOk();
    $path = $response->json('path');

    expect($path)->toBeString();
    Storage::disk('public')->assertExists($path);
});
