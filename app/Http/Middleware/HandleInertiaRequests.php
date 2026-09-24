<?php

namespace App\Http\Middleware;

use App\Enums\Permission as PermissionEnum;
use App\Models\PlatformSetting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'platform' => PlatformSetting::current(),
            'auth' => [
                'user' => $request->user(),
                'permissions' => $this->permissions($request),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    /**
     * Resolve the permission names the authenticated user can use.
     *
     * @return array<int, string>
     */
    protected function permissions(Request $request): array
    {
        $user = $request->user();

        if (! $user) {
            return [];
        }

        if ($user->hasRole('superadmin')) {
            return collect(PermissionEnum::cases())
                ->map(fn (PermissionEnum $permission): string => $permission->value)
                ->values()
                ->all();
        }

        return $user->getAllPermissions()->pluck('name')->values()->all();
    }
}
