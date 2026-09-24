<?php

namespace App\Http\Requests\Media;

use App\Enums\MediaStatus;
use App\Enums\MediaType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MediaRequest extends FormRequest
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
            'type' => ['required', Rule::enum(MediaType::class)],
            'file' => ['nullable', 'string', 'max:2048', 'required_without:url'],
            'url' => ['nullable', 'url', 'max:2048'],
            'thumbnail' => ['nullable', 'string', 'max:2048'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', Rule::enum(MediaStatus::class)],
        ];
    }

    /**
     * Normalise the request into the column payload.
     *
     * @return array<string, mixed>
     */
    public function normalized(): array
    {
        $data = $this->validated();
        $media = $this->route('media');

        $type = $data['type'] ?? $media?->type?->value ?? MediaType::Photo->value;

        $data['sort_order'] = $data['sort_order'] ?? $media?->sort_order ?? 0;
        $data['status'] = $data['status'] ?? $media?->status?->value ?? MediaStatus::Draft->value;

        if (! empty($data['url'] ?? null)) {
            $data['file'] = null;
        }

        if ($type === MediaType::Video->value) {
            $thumbnail = $data['thumbnail'] ?? null;

            if (empty($thumbnail) && ! empty($data['url'] ?? null)) {
                $thumbnail = $this->youtubeThumbnail($data['url']);
            }

            $data['thumbnail'] = $thumbnail;
        } else {
            $data['thumbnail'] = null;
        }

        return $data;
    }

    /**
     * Resolve the auto thumbnail for a YouTube link.
     */
    private function youtubeThumbnail(string $url): ?string
    {
        $pattern = '/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/';

        if (preg_match($pattern, $url, $matches) !== 1) {
            return null;
        }

        return "https://img.youtube.com/vi/{$matches[1]}/hqdefault.jpg";
    }
}
