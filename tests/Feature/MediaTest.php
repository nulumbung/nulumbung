<?php

use App\Models\Media;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
});

function mediaManager(): User
{
    $user = User::factory()->create();
    $user->assignRole('superadmin');

    return $user;
}

test('media page requires authentication', function () {
    $this->get(route('management.media.index'))
        ->assertRedirect(route('login'));
});

test('media page requires the manage-media permission', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('management.media.index'))
        ->assertForbidden();
});

test('media page is displayed', function () {
    $this->actingAs(mediaManager())
        ->get(route('management.media.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/media/index')
            ->where('filters.search', '')
            ->where('filters.type', '')
            ->where('filters.status', ''));
});

test('media create page is displayed', function () {
    $this->actingAs(mediaManager())
        ->get(route('management.media.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/media/create'));
});

test('media show page is displayed', function () {
    $media = Media::factory()->create();

    $this->actingAs(mediaManager())
        ->get(route('management.media.show', $media))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/media/show')
            ->where('media.id', $media->id));
});

test('media edit page is displayed', function () {
    $media = Media::factory()->create();

    $this->actingAs(mediaManager())
        ->get(route('management.media.edit', $media))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/media/edit')
            ->where('media.id', $media->id));
});

test('media items are paginated ten per page', function () {
    Media::factory()->count(11)->create();

    $this->actingAs(mediaManager())
        ->get(route('management.media.index'))
        ->assertInertia(fn ($page) => $page
            ->where('media.total', 11)
            ->where('media.per_page', 10)
            ->where('media.last_page', 2)
            ->where('media.data', fn ($data) => count($data) === 10));
});

test('media items can be searched and filtered', function () {
    $item = Media::factory()->create(['title' => 'Kegiatan Maulid']);

    $this->actingAs(mediaManager())
        ->get(route('management.media.index', ['search' => 'maulid', 'type' => 'photo']))
        ->assertInertia(fn ($page) => $page
            ->where('filters.search', 'maulid')
            ->where('filters.type', 'photo')
            ->where('media.total', 1)
            ->where('media.data', fn ($data) => ($data[0]['id'] ?? null) === $item->id));
});

test('a media item uses a uuid primary key', function () {
    $media = Media::factory()->create();

    expect(Str::isUuid($media->id))->toBeTrue();
});

test('a media photo exposes its preview url', function () {
    $media = Media::factory()->create(['file' => 'media/photo.jpg']);

    expect($media->file_url)->toEndWith('/storage/media/photo.jpg')
        ->and($media->preview_url)->toEndWith('/storage/media/photo.jpg');
});

test('a media item can be created', function () {
    $this->actingAs(mediaManager())
        ->post(route('management.media.store'), [
            'title' => 'Kegiatan Maulid',
            'type' => 'photo',
            'file' => 'media/photo.jpg',
            'description' => '<p>Dokumentasi kegiatan.</p>',
            'sort_order' => 3,
            'status' => 'publish',
        ])
        ->assertRedirect(route('management.media.edit', Media::where('title', 'Kegiatan Maulid')->first()))
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    $media = Media::where('title', 'Kegiatan Maulid')->first();
    expect($media)->not->toBeNull()
        ->and($media->type->value)->toBe('photo')
        ->and($media->status->value)->toBe('publish')
        ->and($media->sort_order)->toBe(3);
});

test('a media file or url is required', function () {
    $this->actingAs(mediaManager())
        ->post(route('management.media.store'), [
            'title' => 'Tanpa berkas',
            'type' => 'photo',
            'status' => 'draft',
        ])
        ->assertSessionHasErrors(['file']);
});

test('a media url replaces the uploaded file', function () {
    $this->actingAs(mediaManager())
        ->post(route('management.media.store'), [
            'title' => 'Foto dari URL',
            'type' => 'photo',
            'file' => 'media/photo.jpg',
            'url' => 'https://example.com/photo.jpg',
            'status' => 'publish',
        ])
        ->assertRedirect();

    $media = Media::where('title', 'Foto dari URL')->first();
    expect($media->file)->toBeNull()
        ->and($media->url)->toBe('https://example.com/photo.jpg');
});

test('a youtube url fills the video thumbnail automatically', function () {
    $this->actingAs(mediaManager())
        ->post(route('management.media.store'), [
            'title' => 'Video YouTube',
            'type' => 'video',
            'url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'status' => 'publish',
        ])
        ->assertRedirect();

    $media = Media::where('title', 'Video YouTube')->first();
    expect($media->thumbnail)->toBe('https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
});

test('a media item can be updated', function () {
    $media = Media::factory()->create(['title' => 'Lama']);

    $this->actingAs(mediaManager())
        ->from(route('management.media.index'))
        ->patch(route('management.media.update', $media), [
            'title' => 'Baru',
            'status' => 'archive',
        ])
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    expect($media->refresh()->title)->toBe('Baru')
        ->and($media->status->value)->toBe('archive');
});

test('a media item can be deleted', function () {
    $media = Media::factory()->create();

    $this->actingAs(mediaManager())
        ->from(route('management.media.index'))
        ->delete(route('management.media.destroy', $media))
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    expect(Media::find($media->id))->toBeNull();
});

test('a media file can be uploaded', function () {
    Storage::fake('public');

    $response = $this->actingAs(mediaManager())
        ->post(route('management.media.upload-file'), [
            'file' => UploadedFile::fake()->image('photo.jpg', 200, 200),
        ]);

    $response->assertOk();
    $path = $response->json('path');

    expect($path)->toBeString();
    Storage::disk('public')->assertExists($path);
});

test('a media thumbnail can be uploaded', function () {
    Storage::fake('public');

    $response = $this->actingAs(mediaManager())
        ->post(route('management.media.upload-thumbnail'), [
            'thumbnail' => UploadedFile::fake()->image('thumb.jpg', 320, 180),
        ]);

    $response->assertOk();
    $path = $response->json('path');

    expect($path)->toBeString();
    Storage::disk('public')->assertExists($path);
});
