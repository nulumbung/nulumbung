<?php

use App\Enums\BanomOfficerStatus;
use App\Enums\BanomPosition;
use App\Models\Banom;
use App\Models\BanomOfficer;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Illuminate\Support\Str;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
});

function banomOfficerManager(): User
{
    $user = User::factory()->create();
    $user->assignRole('superadmin');

    return $user;
}

test('banom officers page requires authentication', function () {
    $banom = Banom::factory()->create();

    $this->get(route('management.banom.officers.index', $banom))
        ->assertRedirect(route('login'));
});

test('banom officers page requires the manage-banom permission', function () {
    $banom = Banom::factory()->create();

    $this->actingAs(User::factory()->create())
        ->get(route('management.banom.officers.index', $banom))
        ->assertForbidden();
});

test('banom officers page is displayed', function () {
    $banom = Banom::factory()->create(['name' => 'Tapak Suci']);

    $this->actingAs(banomOfficerManager())
        ->get(route('management.banom.officers.index', $banom))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/banom/officers')
            ->where('banom.id', $banom->id)
            ->where('filters.status', 'aktif')
            ->where('filters.search', ''));
});

test('banom officers default to the active status filter', function () {
    $banom = Banom::factory()->create();
    BanomOfficer::factory()->create(['banom_id' => $banom->id, 'name' => 'Ahmad']);
    $demisioner = BanomOfficer::factory()->demisioner()->create([
        'banom_id' => $banom->id,
        'name' => 'Budi',
    ]);

    $this->actingAs(banomOfficerManager())
        ->get(route('management.banom.officers.index', $banom))
        ->assertInertia(fn ($page) => $page
            ->where('officers.total', 1)
            ->where('officers.data.0.id', fn ($id) => $id !== $demisioner->id));
});

test('banom officers can be filtered by status', function () {
    $banom = Banom::factory()->create();
    BanomOfficer::factory()->create(['banom_id' => $banom->id, 'name' => 'Ahmad']);
    $demisioner = BanomOfficer::factory()->demisioner()->create([
        'banom_id' => $banom->id,
        'name' => 'Budi',
    ]);

    $this->actingAs(banomOfficerManager())
        ->get(route('management.banom.officers.index', [$banom, 'status' => 'demisioner']))
        ->assertInertia(fn ($page) => $page
            ->where('filters.status', 'demisioner')
            ->where('officers.total', 1)
            ->where('officers.data.0.id', $demisioner->id));
});

test('banom officers can be searched', function () {
    $banom = Banom::factory()->create();
    $officer = BanomOfficer::factory()->create([
        'banom_id' => $banom->id,
        'name' => 'Ahmad Fauzi',
    ]);
    BanomOfficer::factory()->create(['banom_id' => $banom->id, 'name' => 'Budi']);

    $this->actingAs(banomOfficerManager())
        ->get(route('management.banom.officers.index', [$banom, 'search' => 'fauzi']))
        ->assertInertia(fn ($page) => $page
            ->where('filters.search', 'fauzi')
            ->where('officers.total', 1)
            ->where('officers.data', fn ($data) => ($data[0]['id'] ?? null) === $officer->id));
});

test('officers of a banom are ordered by position and period', function () {
    $banom = Banom::factory()->create();
    $secretary = BanomOfficer::factory()->create([
        'banom_id' => $banom->id,
        'name' => 'Budi',
        'position' => BanomPosition::Sekretaris,
        'period' => '2024-2026',
    ]);
    $chairman = BanomOfficer::factory()->create([
        'banom_id' => $banom->id,
        'name' => 'Ahmad',
        'position' => BanomPosition::Ketua,
        'period' => '2024-2026',
    ]);

    $this->actingAs(banomOfficerManager())
        ->get(route('management.banom.officers.index', $banom))
        ->assertInertia(fn ($page) => $page
            ->where('officers.data.0.id', $chairman->id)
            ->where('officers.data.1.id', $secretary->id));
});

test('a banom officer uses a uuid primary key', function () {
    $officer = BanomOfficer::factory()->create();

    expect(Str::isUuid($officer->id))->toBeTrue();
});

test('a banom officer exposes its photo url', function () {
    $officer = BanomOfficer::factory()->create(['photo' => 'banom/photo.jpg']);

    expect($officer->photo_url)->toEndWith('/storage/banom/photo.jpg');
});

test('an officer can be added to a banom', function () {
    $banom = Banom::factory()->create();

    $this->actingAs(banomOfficerManager())
        ->post(route('management.banom.officers.store', $banom), [
            'name' => 'Ahmad Fauzi',
            'position' => BanomPosition::Ketua->value,
            'period' => '2024-2026',
            'status' => BanomOfficerStatus::Aktif->value,
        ])
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    expect($banom->officers()->count())->toBe(1)
        ->and($banom->officers()->first()->name)->toBe('Ahmad Fauzi');
});

test('an officer name is required', function () {
    $banom = Banom::factory()->create();

    $this->actingAs(banomOfficerManager())
        ->post(route('management.banom.officers.store', $banom), [
            'name' => '',
            'position' => BanomPosition::Ketua->value,
            'status' => BanomOfficerStatus::Aktif->value,
        ])
        ->assertSessionHasErrors(['name']);
});

test('an officer position must be valid', function () {
    $banom = Banom::factory()->create();

    $this->actingAs(banomOfficerManager())
        ->post(route('management.banom.officers.store', $banom), [
            'name' => 'Ahmad',
            'position' => 'presiden',
            'status' => BanomOfficerStatus::Aktif->value,
        ])
        ->assertSessionHasErrors(['position']);
});

test('an officer can be updated', function () {
    $banom = Banom::factory()->create();
    $officer = BanomOfficer::factory()->create([
        'banom_id' => $banom->id,
        'name' => 'Ahmad',
        'position' => BanomPosition::Bendahara,
    ]);

    $this->actingAs(banomOfficerManager())
        ->patch(route('management.banom.officers.update', [$banom, $officer]), [
            'name' => 'Ahmad Fauzi',
            'position' => BanomPosition::Ketua->value,
            'period' => '2026-2028',
            'status' => BanomOfficerStatus::Demisioner->value,
        ])
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    expect($officer->refresh()->name)->toBe('Ahmad Fauzi')
        ->and($officer->position)->toBe(BanomPosition::Ketua)
        ->and($officer->status)->toBe(BanomOfficerStatus::Demisioner);
});

test('an officer can be deleted', function () {
    $banom = Banom::factory()->create();
    $officer = BanomOfficer::factory()->create(['banom_id' => $banom->id]);
    $from = route('management.banom.officers.index', $banom);

    $this->actingAs(banomOfficerManager())
        ->from($from)
        ->delete(route('management.banom.officers.destroy', [$banom, $officer]))
        ->assertRedirect($from)
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    expect(BanomOfficer::find($officer->id))->toBeNull();
});

test('deleting a banom deletes its officers', function () {
    $banom = Banom::factory()->create();
    $officer = BanomOfficer::factory()->create(['banom_id' => $banom->id]);

    $this->actingAs(banomOfficerManager())
        ->delete(route('management.banom.destroy', $banom));

    expect(Banom::find($banom->id))->toBeNull()
        ->and(BanomOfficer::find($officer->id))->toBeNull();
});
