<?php

namespace App\Http\Requests\System;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PlatformUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'brand_name' => ['nullable', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:png,jpeg,jpg,svg', 'max:2048'],
            'favicon' => ['nullable', 'mimes:png,jpeg,jpg,svg,ico', 'max:1024'],
            'mail_mailer' => ['nullable', 'string', 'in:smtp,log'],
            'mail_host' => ['nullable', 'string', 'max:255'],
            'mail_port' => ['nullable', 'integer', 'min:1', 'max:65535'],
            'mail_scheme' => ['nullable', 'string', 'in:ssl,tls,none'],
            'mail_username' => ['nullable', 'string', 'max:255'],
            'mail_password' => ['nullable', 'string', 'max:255'],
            'mail_from_address' => ['nullable', 'email', 'max:255'],
            'mail_from_name' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:255'],
            'contact_whatsapp' => ['nullable', 'string', 'max:255'],
            'contact_address' => ['nullable', 'string', 'max:1000'],
            'social_facebook' => ['nullable', 'url', 'max:255'],
            'social_instagram' => ['nullable', 'url', 'max:255'],
            'social_youtube' => ['nullable', 'url', 'max:255'],
        ];
    }
}
