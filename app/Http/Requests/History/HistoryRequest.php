<?php

namespace App\Http\Requests\History;

use Illuminate\Foundation\Http\FormRequest;

class HistoryRequest extends FormRequest
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
            'year' => ['nullable', 'string', 'max:20'],
            'image' => ['nullable', 'string', 'max:2048'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
