<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    use HasFactory;
    use HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'year',
        'image',
        'description',
        'sort_order',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['image_url'];

    /**
     * Get the URL for the history image.
     */
    protected function getImageUrlAttribute(): ?string
    {
        return $this->image ? url("storage/{$this->image}") : null;
    }
}
