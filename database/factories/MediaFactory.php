<?php

namespace Database\Factories;

use App\Enums\MediaStatus;
use App\Enums\MediaType;
use App\Models\Media;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Media>
 */
class MediaFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Media>
     */
    protected $model = Media::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->unique()->sentence(3),
            'type' => MediaType::Photo,
            'file' => 'media/'.fake()->uuid().'.jpg',
            'url' => null,
            'thumbnail' => null,
            'description' => fake()->paragraph(),
            'sort_order' => fake()->unique()->numberBetween(1, 100),
            'status' => MediaStatus::Draft,
        ];
    }

    /**
     * Create a video media item.
     */
    public function video(): static
    {
        return $this->state(fn (): array => [
            'type' => MediaType::Video,
            'file' => 'media/'.fake()->uuid().'.mp4',
        ]);
    }
}
