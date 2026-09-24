<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a list of users with optional search and pagination.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $users = User::query()
            ->with('roles')
            ->when($search, fn ($query, $term) => $query
                ->where(fn ($query) => $query
                    ->where('name', 'like', "%{$term}%")
                    ->orWhere('email', 'like', "%{$term}%")))
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'roles' => $this->roleNames(),
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Show the form to create a new user.
     */
    public function create(): Response
    {
        return Inertia::render('admin/users/create', [
            'roles' => $this->roleNames(),
        ]);
    }

    /**
     * Create a new user.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $user = User::create($request->safe()->only(['name', 'email', 'password']));

        if ($request->filled('role')) {
            $user->syncRoles([$request->input('role')]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'User created.']);

        return to_route('management.users.show', $user);
    }

    /**
     * Display the given user.
     */
    public function show(User $user): Response
    {
        $user->load('roles');

        return Inertia::render('admin/users/show', [
            'user' => $user,
            'roles' => $this->roleNames(),
        ]);
    }

    /**
     * Show the form to edit the given user.
     */
    public function edit(User $user): Response
    {
        $user->load('roles');

        return Inertia::render('admin/users/edit', [
            'user' => $user,
            'roles' => $this->roleNames(),
        ]);
    }

    /**
     * Update the given user.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = $request->safe()->only(['name', 'email']);

        if ($request->filled('password')) {
            $data['password'] = $request->string('password')->toString();
        }

        $user->update($data);

        $user->syncRoles($request->filled('role') ? [$request->input('role')] : []);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'User updated.']);

        return to_route('management.users.show', $user);
    }

    /**
     * Delete the given user.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'You cannot delete your own account.']);

            return back();
        }

        $user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'User deleted.']);

        return to_route('management.users.index');
    }

    /**
     * Get the available role names sorted alphabetically.
     *
     * @return array<int, string>
     */
    private function roleNames(): array
    {
        return Role::pluck('name')->sort()->values()->all();
    }
}
