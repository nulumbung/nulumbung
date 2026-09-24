<?php

namespace App\Http\Controllers;

use App\Enums\Permission as PermissionEnum;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    /**
     * Display the permission matrix for assigning page access to roles.
     */
    public function index(): Response
    {
        $roles = Role::query()
            ->with('permissions:id,name')
            ->orderBy('name')
            ->get()
            ->map(fn (Role $role): array => [
                'id' => $role->id,
                'name' => $role->name,
                'permission_names' => $role->permissions->pluck('name')->values()->all(),
            ])
            ->all();

        return Inertia::render('admin/permissions/index', [
            'permissions' => PermissionEnum::options(),
            'roles' => $roles,
        ]);
    }

    /**
     * Replace the permission set assigned to the given role.
     */
    public function update(Request $request, Role $role): RedirectResponse
    {
        if ($role->name === 'superadmin') {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'The superadmin role permissions cannot be changed.']);

            return back();
        }

        $validated = $request->validate([
            'permissions' => ['present', 'array'],
            'permissions.*' => [
                'required',
                'string',
                Rule::in(array_column(PermissionEnum::cases(), 'value')),
            ],
        ]);

        $role->syncPermissions($validated['permissions'] ?? []);

        Inertia::flash('toast', ['type' => 'success', 'message' => "Permissions updated for the role \"{$role->name}\"."]);

        return back();
    }
}
