<?php

namespace Database\Seeders;

use App\Enums\Permission as PermissionEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    /**
     * Seed the application's permissions and grant them to the superadmin role.
     */
    public function run(): void
    {
        foreach (PermissionEnum::cases() as $permission) {
            Permission::findOrCreate($permission->value, 'web');
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $superadmin = Role::findOrCreate('superadmin', 'web');
        $superadmin->syncPermissions(array_map(fn (PermissionEnum $p): string => $p->value, PermissionEnum::cases()));
    }
}
