<?php

namespace App\Providers;

use App\Models\PlatformSetting;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        Gate::before(fn (User $user): ?bool => $user->hasRole('superadmin') ? true : null);

        $this->applyPersistedMailConfiguration();
    }

    /**
     * Apply the SMTP settings stored in the platform settings to the mail
     * configuration so every outbound message uses the persisted connection.
     */
    protected function applyPersistedMailConfiguration(): void
    {
        if (Schema::hasTable('platform_settings')) {
            PlatformSetting::current()->applyMailConfiguration();
        }
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
