<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class SuperSeeder extends Seeder
{
    /**
     * Create the superadmin role and its default credential.
     */
    public function run(): void
    {
        $role = Role::findOrCreate('superadmin', 'web');

        $user = User::query()->updateOrCreate(
            ['email' => 'dev@project.com'],
            [
                'name' => 'Developer',
                'email_verified_at' => now(),
                'password' => Hash::make('2Sukses2!'),
            ],
        );

        $user->assignRole($role);
    }
}
