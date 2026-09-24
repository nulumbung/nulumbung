<?php

use App\Models\Category;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Illuminate\Support\Str;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
});

function categoryManager(): User
{
    $user = User::factory()->create();
    $user->assignRole('superadmin');

    return $user;
}

test('categories page requires authentication', function () {
    $this->get(route('management.categories.index'))
        ->assertRedirect(route('login'));
});

test('categories page requires the manage-categories permission', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('management.categories.index'))
        ->assertForbidden();
});

test('categories page is displayed', function () {
    $this->actingAs(categoryManager())
        ->get(route('management.categories.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/categories/index')
            ->where('filters.search', ''));
});

test('the category create page is displayed', function () {
    $this->actingAs(categoryManager())
        ->get(route('management.categories.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/categories/create'));
});

test('the category edit page is displayed with the category', function () {
    $category = Category::factory()->create(['name' => 'Berita']);

    $this->actingAs(categoryManager())
        ->get(route('management.categories.edit', $category))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/categories/edit')
            ->where('category.id', $category->id)
            ->where('category.name', 'Berita'));
});

test('categories are paginated ten per page', function () {
    Category::factory()->count(11)->create();

    $this->actingAs(categoryManager())
        ->get(route('management.categories.index'))
        ->assertInertia(fn ($page) => $page
            ->where('categories.total', 11)
            ->where('categories.per_page', 10)
            ->where('categories.last_page', 2)
            ->where('categories.data', fn ($data) => count($data) === 10));
});

test('categories can be searched', function () {
    $category = Category::factory()->create(['name' => 'Berita']);

    $this->actingAs(categoryManager())
        ->get(route('management.categories.index', ['search' => 'berita']))
        ->assertInertia(fn ($page) => $page
            ->where('filters.search', 'berita')
            ->where('categories.total', 1)
            ->where('categories.data', fn ($data) => ($data[0]['id'] ?? null) === $category->id));
});

test('a category uses a uuid primary key', function () {
    $category = Category::factory()->create();

    expect(Str::isUuid($category->id))->toBeTrue();
});

test('a category can be created with a generated slug', function () {
    $this->actingAs(categoryManager())
        ->post(route('management.categories.store'), [
            'name' => 'Berita',
            'icon' => 'FaNewspaper',
            'comment' => 'Konten berita harian',
        ])
        ->assertRedirect(route('management.categories.edit', Category::where('slug', 'berita')->first()))
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    $category = Category::where('slug', 'berita')->first();
    expect($category)->not->toBeNull()
        ->and($category->icon)->toBe('FaNewspaper')
        ->and($category->comment)->toBe('Konten berita harian');
});

test('a category can be created with a custom slug', function () {
    $this->actingAs(categoryManager())
        ->post(route('management.categories.store'), [
            'name' => 'Berita',
            'slug' => 'breaking-news',
        ])
        ->assertRedirect(route('management.categories.edit', Category::where('slug', 'breaking-news')->first()))
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    expect(Category::where('slug', 'breaking-news')->exists())->toBeTrue();
});

test('a duplicate slug is made unique', function () {
    $this->actingAs(categoryManager())
        ->post(route('management.categories.store'), ['name' => 'Berita'])
        ->assertRedirect();

    $this->actingAs(categoryManager())
        ->post(route('management.categories.store'), ['name' => 'Berita'])
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    expect(Category::where('slug', 'berita')->exists())->toBeTrue()
        ->and(Category::where('slug', 'berita-2')->exists())->toBeTrue();
});

test('a category name is required', function () {
    $this->actingAs(categoryManager())
        ->post(route('management.categories.store'), ['name' => ''])
        ->assertSessionHasErrors(['name']);
});

test('a slug must be unique when provided', function () {
    Category::factory()->create(['slug' => 'ekonomi']);

    $this->actingAs(categoryManager())
        ->post(route('management.categories.store'), [
            'name' => 'Ekonomi',
            'slug' => 'ekonomi',
        ])
        ->assertSessionHasErrors(['slug']);
});

test('a slug must be a valid url slug', function () {
    $this->actingAs(categoryManager())
        ->post(route('management.categories.store'), [
            'name' => 'Ekonomi',
            'slug' => 'Ekonomi Rupiah',
        ])
        ->assertSessionHasErrors(['slug']);
});

test('a category can be updated', function () {
    $category = Category::factory()->create(['name' => 'Berita']);

    $this->actingAs(categoryManager())
        ->patch(route('management.categories.update', $category), [
            'name' => 'Berita Daerah',
            'icon' => 'MdLocationCity',
        ])
        ->assertRedirect(route('management.categories.edit', $category))
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    expect($category->refresh()->name)->toBe('Berita Daerah')
        ->and($category->icon)->toBe('MdLocationCity');
});

test('a category can be deleted', function () {
    $category = Category::factory()->create();
    $from = route('management.categories.index');

    $this->actingAs(categoryManager())
        ->from($from)
        ->delete(route('management.categories.destroy', $category))
        ->assertRedirect($from)
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    expect(Category::find($category->id))->toBeNull();
});
