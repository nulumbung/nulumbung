<?php

namespace App\Models;

use Database\Factories\CategoryFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    /** @use HasFactory<CategoryFactory> */
    use HasFactory, HasUuids;

    /**
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'icon',
        'comment',
    ];

    public function news(): HasMany
    {
        return $this->hasMany(News::class);
    }
}
