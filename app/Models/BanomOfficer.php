<?php

namespace App\Models;

use App\Enums\BanomOfficerStatus;
use App\Enums\BanomPosition;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BanomOfficer extends Model
{
    use HasFactory;
    use HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'banom_id',
        'photo',
        'name',
        'position',
        'period',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'position' => BanomPosition::class,
            'status' => BanomOfficerStatus::class,
        ];
    }

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['photo_url'];

    /**
     * Get the URL for the officer photo.
     */
    protected function getPhotoUrlAttribute(): ?string
    {
        return $this->photo ? url("storage/{$this->photo}") : null;
    }

    /**
     * The banom this officer belongs to.
     */
    public function banom(): BelongsTo
    {
        return $this->belongsTo(Banom::class);
    }
}
