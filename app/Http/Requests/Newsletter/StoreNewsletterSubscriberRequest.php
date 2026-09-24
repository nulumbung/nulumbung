<?php

namespace App\Http\Requests\Newsletter;

use Illuminate\Validation\Rule;

class StoreNewsletterSubscriberRequest extends NewsletterSubscriberRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $rules = parent::rules();

        $rules['email'] = ['required', 'email', 'max:255', Rule::unique('newsletter_subscribers', 'email')];

        return $rules;
    }
}
