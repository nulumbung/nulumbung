<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlatformSetting extends Model
{
    /**
     * @var array<string>
     */
    protected $fillable = [
        'brand_name',
        'tagline',
        'logo',
        'favicon',
        'mail_mailer',
        'mail_host',
        'mail_port',
        'mail_scheme',
        'mail_username',
        'mail_password',
        'mail_from_address',
        'mail_from_name',
        'contact_email',
        'contact_phone',
        'contact_whatsapp',
        'contact_address',
        'social_facebook',
        'social_instagram',
        'social_youtube',
    ];

    /**
     * Get the single platform settings record.
     */
    public static function current(): self
    {
        return static::firstOrCreate(['id' => 1]);
    }

    /**
     * Apply the stored SMTP settings to the mail configuration.
     */
    public function applyMailConfiguration(): void
    {
        $settings = static::current();

        if (! $settings->mail_mailer) {
            return;
        }

        config(['mail.default' => $settings->mail_mailer]);

        if ($settings->mail_mailer === 'smtp') {
            $scheme = match ($settings->mail_scheme) {
                'ssl' => 'smtps',
                'tls' => 'smtp',
                default => null,
            };

            config([
                'mail.mailers.smtp.host' => $settings->mail_host ?: config('mail.mailers.smtp.host'),
                'mail.mailers.smtp.port' => $settings->mail_port ?: config('mail.mailers.smtp.port'),
                'mail.mailers.smtp.username' => $settings->mail_username ?? config('mail.mailers.smtp.username'),
                'mail.mailers.smtp.password' => $settings->mail_password ?? config('mail.mailers.smtp.password'),
                'mail.mailers.smtp.scheme' => $scheme ?? config('mail.mailers.smtp.scheme'),
            ]);
        }

        config([
            'mail.from.address' => $settings->mail_from_address ?: config('mail.from.address'),
            'mail.from.name' => $settings->mail_from_name ?: config('mail.from.name'),
        ]);
    }
}
