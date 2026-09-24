<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Banom extends Model
{
    use HasFactory;
    use HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'tagline',
        'logo',
        'description',
        'sort_order',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['logo_url'];

    /**
     * Get the URL for the banom logo.
     */
    protected function getLogoUrlAttribute(): ?string
    {
        return $this->logo ? url("storage/{$this->logo}") : null;
    }

    /**
     * The officers belonging to this banom.
     */
    public function officers(): HasMany
    {
        return $this->hasMany(BanomOfficer::class);
    }
}
