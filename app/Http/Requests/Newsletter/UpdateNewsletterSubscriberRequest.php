<?php

namespace App\Http\Requests\Newsletter;

use Illuminate\Validation\Rule;

class UpdateNewsletterSubscriberRequest extends NewsletterSubscriberRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $rules = parent::rules();

        $rules['email'] = [
            'required',
            'email',
            'max:255',
            Rule::unique('newsletter_subscribers', 'email')->ignore($this->route('subscriber')->id),
        ];

        foreach ($rules as $field => $constraints) {
            $rules[$field] = array_merge(['sometimes'], $constraints);
        }

        return $rules;
    }
}
