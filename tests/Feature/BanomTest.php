<?php

use App\Models\Banom;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Illuminate\Support\Str;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
});

function banomManager(): User
{
    $user = User::factory()->create();
    $user->assignRole('superadmin');

    return $user;
}

test('banom page requires authentication', function () {
    $this->get(route('management.banom.index'))
        ->assertRedirect(route('login'));
});

test('banom page requires the manage-banom permission', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('management.banom.index'))
        ->assertForbidden();
});

test('banom page is displayed', function () {
    $this->actingAs(banomManager())
        ->get(route('management.banom.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/banom/index')
            ->where('filters.search', ''));
});

test('the banom create page is displayed', function () {
    $this->actingAs(banomManager())
        ->get(route('management.banom.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/banom/create'));
});

test('the banom edit page is displayed with the banom', function () {
    $banom = Banom::factory()->create(['name' => 'Ikatan Mahasiswa Muhammadiyah']);

    $this->actingAs(banomManager())
        ->get(route('management.banom.edit', $banom))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/banom/edit')
            ->where('banom.id', $banom->id)
            ->where('banom.name', 'Ikatan Mahasiswa Muhammadiyah'));
});

test('banoms are ordered by sort order and paginated ten per page', function () {
    Banom::factory()->count(11)->create();
    $banom = Banom::create(['name' => 'Immawan', 'sort_order' => 0]);

    $this->actingAs(banomManager())
        ->get(route('management.banom.index'))
        ->assertInertia(fn ($page) => $page
            ->where('banoms.total', 12)
            ->where('banoms.per_page', 10)
            ->where('banoms.last_page', 2)
            ->where('banoms.data', fn ($data) => count($data) === 10)
            ->where('banoms.data.0.id', $banom->id));
});

test('banoms can be searched', function () {
    $banom = Banom::factory()->create(['name' => 'Tapak Suci']);

    $this->actingAs(banomManager())
        ->get(route('management.banom.index', ['search' => 'tapak']))
        ->assertInertia(fn ($page) => $page
            ->where('filters.search', 'tapak')
            ->where('banoms.total', 1)
            ->where('banoms.data', fn ($data) => ($data[0]['id'] ?? null) === $banom->id));
});

test('a banom uses a uuid primary key', function () {
    $banom = Banom::factory()->create();

    expect(Str::isUuid($banom->id))->toBeTrue();
});

test('a banom exposes its logo url', function () {
    $banom = Banom::factory()->create(['logo' => 'banom/logo.jpg']);

    expect($banom->logo_url)->toEndWith('/storage/banom/logo.jpg');
});

test('a banom can be created', function () {
    $this->actingAs(banomManager())
        ->post(route('management.banom.store'), [
            'name' => 'Himpunan Mahasiswa Teknik',
            'tagline' => 'Berkarya untuk negeri',
            'sort_order' => 2,
        ])
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    $banom = Banom::where('name', 'Himpunan Mahasiswa Teknik')->first();
    expect($banom)->not->toBeNull()
        ->and($banom->tagline)->toBe('Berkarya untuk negeri')
        ->and($banom->sort_order)->toBe(2);
});

test('a banom name is required', function () {
    $this->actingAs(banomManager())
        ->post(route('management.banom.store'), ['name' => ''])
        ->assertSessionHasErrors(['name']);
});

test('a banom can be updated', function () {
    $banom = Banom::factory()->create(['name' => 'Hima']);

    $this->actingAs(banomManager())
        ->patch(route('management.banom.update', $banom), [
            'name' => 'Hima Teknik',
            'tagline' => 'Solidaritas, Karya, Inovasi',
            'sort_order' => 1,
        ])
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    expect($banom->refresh()->name)->toBe('Hima Teknik')
        ->and($banom->tagline)->toBe('Solidaritas, Karya, Inovasi')
        ->and($banom->sort_order)->toBe(1);
});

test('a banom can be deleted', function () {
    $banom = Banom::factory()->create();
    $from = route('management.banom.index');

    $this->actingAs(banomManager())
        ->from($from)
        ->delete(route('management.banom.destroy', $banom))
        ->assertRedirect($from)
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    expect(Banom::find($banom->id))->toBeNull();
});
