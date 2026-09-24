<?php

namespace App\Models;

use App\Enums\MediaStatus;
use App\Enums\MediaType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Media extends Model
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
        'type',
        'file',
        'url',
        'thumbnail',
        'description',
        'sort_order',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'type' => MediaType::class,
        'status' => MediaStatus::class,
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['file_url', 'thumbnail_url', 'preview_url'];

    /**
     * Get the URL for the media file.
     */
    protected function getFileUrlAttribute(): ?string
    {
        return $this->toUrl($this->file);
    }

    /**
     * Get the URL for the media thumbnail.
     */
    protected function getThumbnailUrlAttribute(): ?string
    {
        return $this->toUrl($this->thumbnail);
    }

    /**
     * Get the URL to display as the preview image.
     */
    protected function getPreviewUrlAttribute(): ?string
    {
        if ($this->type === MediaType::Photo) {
            return $this->getFileUrlAttribute() ?? $this->url;
        }

        return $this->getThumbnailUrlAttribute() ?? $this->getFileUrlAttribute();
    }

    /**
     * Resolve a stored path or external URL into a usable URL.
     */
    private function toUrl(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        return Str::startsWith($value, ['http://', 'https://'])
            ? $value
            : asset('storage/'.$value);
    }
}
