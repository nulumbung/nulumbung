<?php

namespace App\Http\Requests\Newsletter;

use App\Enums\NewsletterStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NewsletterSubscriberRequest extends FormRequest
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
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::enum(NewsletterStatus::class)],
        ];
    }
}
