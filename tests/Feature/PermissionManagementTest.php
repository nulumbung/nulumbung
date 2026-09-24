<?php

use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
});

function permissionManager(): User
{
    $user = User::factory()->create();
    $user->givePermissionTo('manage-permissions');

    return $user;
}

test('guests are redirected to login when visiting the permissions index', function () {
    $this->get(route('management.permissions.index'))
        ->assertRedirect(route('login'));
});

test('users without the manage-permissions permission are forbidden from the permissions index', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('management.permissions.index'))
        ->assertForbidden();
});

test('users with the manage-permissions permission can visit the permissions index', function () {
    $this->actingAs(permissionManager())
        ->get(route('management.permissions.index'))
        ->assertOk();
});

test('the permissions index shows the permission catalog and roles', function () {
    $this->actingAs(permissionManager())
        ->get(route('management.permissions.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/permissions/index')
            ->where('permissions', fn ($value) => collect($value)->pluck('value')->contains('manage-permissions'))
            ->where('roles', fn ($value) => collect($value)->pluck('name')->contains('superadmin')));
});

test('role permissions can be updated from the permissions matrix', function () {
    $role = Role::create(['name' => 'editor']);
    $role->syncPermissions(['manage-news']);

    $this->actingAs(permissionManager())
        ->patch(route('management.permissions.update', $role), [
            'permissions' => ['manage-media'],
        ])
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'success');

    $names = $role->refresh()->getPermissionNames()->all();

    expect($names)->toBe(['manage-media']);
});

test('an invalid permission is rejected when updating a role from the matrix', function () {
    $role = Role::create(['name' => 'editor']);

    $this->actingAs(permissionManager())
        ->patch(route('management.permissions.update', $role), [
            'permissions' => ['manage-news', 'not-a-permission'],
        ])
        ->assertSessionHasErrors('permissions.1');
});

test('permissions are required when updating a role from the matrix', function () {
    $role = Role::create(['name' => 'editor']);

    $this->actingAs(permissionManager())
        ->patch(route('management.permissions.update', $role))
        ->assertSessionHasErrors('permissions');
});

test('the superadmin role permissions cannot be changed from the matrix', function () {
    $role = Role::where('name', 'superadmin')->firstOrFail();

    $this->actingAs(permissionManager())
        ->patch(route('management.permissions.update', $role), [
            'permissions' => ['manage-news'],
        ])
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'error');

    expect($role->refresh()->getPermissionNames())->toContain('manage-system');
});
