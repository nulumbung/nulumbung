<?php

use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
});

function userWithPermission(string $permission): User
{
    $user = User::factory()->create();
    $user->givePermissionTo($permission);

    return $user;
}

test('guests are redirected to login when visiting the users index', function () {
    $this->get(route('management.users.index'))
        ->assertRedirect(route('login'));
});

test('users without the manage-users permission are forbidden from the users index', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('management.users.index'))
        ->assertForbidden();
});

test('users with the manage-users permission can visit the users index', function () {
    $this->actingAs(userWithPermission('manage-users'))
        ->get(route('management.users.index'))
        ->assertOk();
});

test('users can be created with an optional role', function () {
    $role = Role::create(['name' => 'editor']);

    $this->actingAs(userWithPermission('manage-users'))
        ->post(route('management.users.store'), [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'secret-password',
            'role' => $role->name,
        ])
        ->assertRedirect(route('management.users.show', User::where('email', 'jane@example.com')->first()));

    $user = User::where('email', 'jane@example.com')->first();

    expect($user)->not->toBeNull();
    expect($user->name)->toBe('Jane Doe');
    expect(Hash::isHashed($user->password))->toBeTrue();
    expect($user->role_names)->toBe(['editor']);
});

test('duplicate user emails are rejected when creating a user', function () {
    User::factory()->create(['email' => 'taken@example.com']);

    $this->actingAs(userWithPermission('manage-users'))
        ->post(route('management.users.store'), [
            'name' => 'Jane Doe',
            'email' => 'taken@example.com',
            'password' => 'secret-password',
            'role' => '',
        ])
        ->assertSessionHasErrors('email');
});

test('users can be updated including an optional password and role', function () {
    $user = User::factory()->create();
    $role = Role::create(['name' => 'editor']);

    $this->actingAs(userWithPermission('manage-users'))
        ->patch(route('management.users.update', $user), [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'new-password',
            'role' => $role->name,
        ])
        ->assertRedirect(route('management.users.show', $user));

    $user->refresh();

    expect($user->name)->toBe('Jane Doe');
    expect($user->email)->toBe('jane@example.com');
    expect(Hash::check('new-password', $user->password))->toBeTrue();
    expect($user->role_names)->toBe(['editor']);
});

test('leaving the password blank keeps the current password', function () {
    $user = User::factory()->create(['password' => 'original-password']);

    $this->actingAs(userWithPermission('manage-users'))
        ->patch(route('management.users.update', $user), [
            'name' => $user->name,
            'email' => $user->email,
            'password' => '',
            'role' => '',
        ])
        ->assertRedirect(route('management.users.show', $user));

    expect(Hash::check('original-password', $user->fresh()->password))->toBeTrue();
});

test('administrators cannot delete their own account', function () {
    $admin = userWithPermission('manage-users');

    $this->actingAs($admin)
        ->delete(route('management.users.destroy', $admin))
        ->assertRedirect();

    expect(User::where('id', $admin->id)->exists())->toBeTrue();
});

test('administrators can delete other users', function () {
    $admin = userWithPermission('manage-users');
    $target = User::factory()->create();

    $this->actingAs($admin)
        ->delete(route('management.users.destroy', $target))
        ->assertRedirect(route('management.users.index'));

    expect(User::where('id', $target->id)->exists())->toBeFalse();
});
