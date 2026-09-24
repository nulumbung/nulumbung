<?php

use App\Models\User;
use Database\Seeders\SuperSeeder;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->seed(SuperSeeder::class);
});

test('superadmin role is created', function () {
    expect(Role::where('name', 'superadmin')->exists())->toBeTrue();
});

test('superadmin user is created with bcrypt password and role', function () {
    $user = DB::table('users')->where('email', 'dev@project.com')->first();

    expect($user)->not->toBeNull();
    expect($user->name)->toBe('Developer');
    expect($user->email_verified_at)->not->toBeNull();
    expect(password_verify('2Sukses2!', $user->password))->toBeTrue();
    expect(Hash::isHashed($user->password))->toBeTrue();
    expect(DB::table('model_has_roles')
        ->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
        ->where('model_has_roles.model_id', $user->id)
        ->where('model_has_roles.model_type', User::class)
        ->where('roles.name', 'superadmin')
        ->exists())->toBeTrue();
});

test('superadmin seeder is idempotent', function () {
    $this->seed(SuperSeeder::class);

    expect(DB::table('users')->where('email', 'dev@project.com')->count())->toBe(1);
    expect(Role::where('name', 'superadmin')->count())->toBe(1);
});
