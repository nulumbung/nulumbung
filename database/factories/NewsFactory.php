<?php

namespace Database\Factories;

use App\Enums\NewsStatus;
use App\Models\Category;
use App\Models\News;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Ramsey\Uuid\Uuid;

/**
 * @extends Factory<News>
 */
class NewsFactory extends Factory
{
    /**
     * @var class-string<News>
     */
    protected $model = News::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(4);
        $slug = Str::slug($title);

        return [
            'id' => Uuid::uuid5('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', $slug)->toString(),
            'title' => $title,
            'slug' => $slug,
            'image' => fake()->optional()->sha1().'.jpg',
            'image_caption' => fake()->optional()->sentence(),
            'description' => fake()->optional()->paragraphs(3, true),
            'category_id' => Category::factory(),
            'publish_at' => fake()->optional()->dateTimeThisYear(),
            'status' => NewsStatus::Draft->value,
            'publisher' => fake()->optional()->name(),
            'is_headline' => false,
            'is_trending' => false,
            'is_popular' => false,
            'is_latest' => false,
            'is_newsletter' => false,
        ];
    }
}
