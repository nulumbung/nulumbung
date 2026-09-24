<?php

namespace App\Http\Controllers;

use App\Enums\Permission as PermissionEnum;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a list of roles with optional search and pagination.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $roles = Role::query()
            ->with('permissions')
            ->withCount(['users', 'permissions'])
            ->when($search, fn ($query, $term) => $query->where('name', 'like', "%{$term}%"))
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $roles->getCollection()->transform(function (Role $role): Role {
            $role->setAttribute('permission_names', $role->getPermissionNames()->all());

            return $role;
        });

        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
            'permissions' => PermissionEnum::options(),
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Show the form to create a new role.
     */
    public function create(): Response
    {
        return Inertia::render('admin/roles/create', [
            'permissions' => PermissionEnum::options(),
        ]);
    }

    /**
     * Create a new role.
     */
    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $role = Role::create(['name' => $request->input('name')]);

        $role->syncPermissions($request->validated('permissions') ?? []);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Role created.']);

        return to_route('management.roles.show', $role);
    }

    /**
     * Display the given role.
     */
    public function show(Role $role): Response
    {
        $role->loadCount(['users', 'permissions']);
        $role->setAttribute('permission_names', $role->getPermissionNames()->all());

        return Inertia::render('admin/roles/show', [
            'role' => $role,
            'permissions' => PermissionEnum::options(),
            'users' => $role->users()->latest('users.created_at')->get(['id', 'name', 'email']),
        ]);
    }

    /**
     * Show the form to edit the given role.
     */
    public function edit(Role $role): Response
    {
        $role->setAttribute('permission_names', $role->getPermissionNames()->all());

        return Inertia::render('admin/roles/edit', [
            'role' => $role,
            'permissions' => PermissionEnum::options(),
        ]);
    }

    /**
     * Update the given role.
     */
    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        if ($role->name === 'superadmin' && $request->input('name') !== 'superadmin') {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'The superadmin role cannot be renamed.']);

            return back();
        }

        $role->update(['name' => $request->input('name')]);

        if ($role->name !== 'superadmin') {
            $role->syncPermissions($request->validated('permissions') ?? []);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Role updated.']);

        return to_route('management.roles.show', $role);
    }

    /**
     * Delete the given role.
     */
    public function destroy(Role $role): RedirectResponse
    {
        if ($role->name === 'superadmin') {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'The superadmin role cannot be deleted.']);

            return back();
        }

        if ($role->users()->count() > 0) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'This role is still assigned to users.']);

            return back();
        }

        $role->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Role deleted.']);

        return to_route('management.roles.index');
    }
}
