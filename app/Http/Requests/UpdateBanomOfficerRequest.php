<?php

namespace App\Http\Requests;

use App\Enums\BanomOfficerStatus;
use App\Enums\BanomPosition;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBanomOfficerRequest extends FormRequest
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
            'photo' => ['nullable', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'position' => ['required', Rule::enum(BanomPosition::class)],
            'period' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::enum(BanomOfficerStatus::class)],
        ];
    }
}
