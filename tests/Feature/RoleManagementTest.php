<?php

use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
});

function roleManager(): User
{
    $user = User::factory()->create();
    $user->givePermissionTo('manage-roles');

    return $user;
}

test('guests are redirected to login when visiting the roles index', function () {
    $this->get(route('management.roles.index'))
        ->assertRedirect(route('login'));
});

test('users without the manage-roles permission are forbidden from the roles index', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('management.roles.index'))
        ->assertForbidden();
});

test('users with the manage-roles permission can visit the roles index', function () {
    $this->actingAs(roleManager())
        ->get(route('management.roles.index'))
        ->assertOk();
});

test('roles can be created', function () {
    $this->actingAs(roleManager())
        ->post(route('management.roles.store'), [
            'name' => 'editor',
        ])
        ->assertRedirect(route('management.roles.show', Role::where('name', 'editor')->first()));

    expect(Role::where('name', 'editor')->exists())->toBeTrue();
});

test('roles can be created with permissions', function () {
    $this->actingAs(roleManager())
        ->post(route('management.roles.store'), [
            'name' => 'editor',
            'permissions' => ['manage-news', 'manage-categories'],
        ])
        ->assertRedirect(route('management.roles.show', Role::where('name', 'editor')->first()));

    $role = Role::where('name', 'editor')->first();

    expect($role->getPermissionNames()->all())->toBe(['manage-news', 'manage-categories']);
});

test('an invalid permission is rejected when creating a role', function () {
    $this->actingAs(roleManager())
        ->post(route('management.roles.store'), [
            'name' => 'editor',
            'permissions' => ['manage-news', 'not-a-permission'],
        ])
        ->assertSessionHasErrors('permissions.1');
});

test('role permissions are synced on update', function () {
    $role = Role::create(['name' => 'editor']);
    $role->syncPermissions(['manage-news']);

    $this->actingAs(roleManager())
        ->patch(route('management.roles.update', $role), [
            'name' => 'editor',
            'permissions' => ['manage-media', 'manage-history'],
        ])
        ->assertRedirect(route('management.roles.show', $role));

    $names = $role->refresh()->getPermissionNames()->all();
    sort($names);

    expect($names)->toBe(['manage-history', 'manage-media']);
});

test('the superadmin role permissions cannot be changed', function () {
    $role = Role::where('name', 'superadmin')->firstOrFail();

    $this->actingAs(roleManager())
        ->patch(route('management.roles.update', $role), [
            'name' => 'superadmin',
            'permissions' => ['manage-news'],
        ])
        ->assertRedirect(route('management.roles.show', $role));

    expect($role->refresh()->getPermissionNames())->toContain('manage-system');
});

test('the role create page includes the permission catalog', function () {
    $this->actingAs(roleManager())
        ->get(route('management.roles.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/roles/create')
            ->where('permissions', fn ($value) => collect($value)->pluck('value')->contains('manage-news')));
});

test('the role edit page includes the assigned permissions', function () {
    $role = Role::create(['name' => 'editor']);
    $role->syncPermissions(['manage-news']);

    $this->actingAs(roleManager())
        ->get(route('management.roles.edit', $role))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('role.permission_names', ['manage-news'])
            ->where('permissions', fn ($value) => collect($value)->isNotEmpty()));
});

test('role names must be unique', function () {
    Role::create(['name' => 'editor']);

    $this->actingAs(roleManager())
        ->post(route('management.roles.store'), [
            'name' => 'editor',
        ])
        ->assertSessionHasErrors('name');
});

test('roles can be renamed', function () {
    $role = Role::create(['name' => 'editor']);

    $this->actingAs(roleManager())
        ->patch(route('management.roles.update', $role), [
            'name' => 'writer',
        ])
        ->assertRedirect(route('management.roles.show', $role));

    expect($role->fresh()->name)->toBe('writer');
});

test('the superadmin role cannot be renamed', function () {
    $role = Role::where('name', 'superadmin')->firstOrFail();

    $this->actingAs(roleManager())
        ->patch(route('management.roles.update', $role), [
            'name' => 'renamed',
        ])
        ->assertRedirect()
        ->assertSessionHas('inertia.flash_data.toast.type', 'error');

    expect($role->fresh()->name)->toBe('superadmin');
});

test('the superadmin role cannot be deleted', function () {
    $role = Role::where('name', 'superadmin')->firstOrFail();

    $this->actingAs(roleManager())
        ->delete(route('management.roles.destroy', $role))
        ->assertRedirect();

    expect(Role::where('id', $role->id)->exists())->toBeTrue();
});

test('a role still assigned to users cannot be deleted', function () {
    $user = User::factory()->create();
    $role = Role::create(['name' => 'editor']);
    $user->assignRole($role);

    $this->actingAs(roleManager())
        ->delete(route('management.roles.destroy', $role))
        ->assertRedirect();

    expect(Role::where('id', $role->id)->exists())->toBeTrue();
});

test('an unassigned role can be deleted', function () {
    $role = Role::create(['name' => 'editor']);

    $this->actingAs(roleManager())
        ->delete(route('management.roles.destroy', $role))
        ->assertRedirect(route('management.roles.index'));

    expect(Role::where('id', $role->id)->exists())->toBeFalse();
});
