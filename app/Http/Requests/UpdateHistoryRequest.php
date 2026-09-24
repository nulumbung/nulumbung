<?php

namespace App\Http\Requests;

use App\Http\Requests\History\HistoryRequest;

class UpdateHistoryRequest extends HistoryRequest
{
    /**
     * Only touch fields that were actually provided on update.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $rules = parent::rules();

        foreach ($rules as $field => $constraints) {
            if (is_array($constraints)) {
                array_unshift($constraints, 'sometimes');

                $rules[$field] = $constraints;
            }
        }

        return $rules;
    }
}
