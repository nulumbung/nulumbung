<?php

namespace App\Http\Requests;

use App\Enums\NewsStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateNewsRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'max:255'],
            'image_caption' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'publish_at' => ['required', 'date'],
            'status' => ['required', Rule::enum(NewsStatus::class)],
            'is_headline' => ['nullable', 'boolean'],
            'is_trending' => ['nullable', 'boolean'],
            'is_popular' => ['nullable', 'boolean'],
            'is_latest' => ['nullable', 'boolean'],
            'is_newsletter' => ['nullable', 'boolean'],
        ];
    }
}
