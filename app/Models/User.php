<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property int $id
 * @property string|null $avatar
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string|null $whatsapp
 * @property string $password
 * @property string|null $address
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property array<int, string> $role_names
 */
#[Fillable(['name', 'email', 'password', 'avatar', 'whatsapp', 'address'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail, PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be appended to the model's array form.
     *
     * @return array<int, string>
     */
    protected $appends = ['role_names'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Get the avatar's public URL. The raw image data is stored base64-encoded
     * directly in the database and served through the user.avatar route.
     */
    protected function getAvatarAttribute(?string $value): ?string
    {
        return $value ? route('user.avatar', ['user' => $this]) : null;
    }

    /**
     * Get the names of all roles assigned to the user.
     *
     * @return array<int, string>
     */
    protected function getRoleNamesAttribute(): array
    {
        return $this->roles->pluck('name')->values()->all();
    }
}
