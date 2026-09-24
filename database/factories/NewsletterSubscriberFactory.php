<?php

namespace Database\Factories;

use App\Enums\NewsletterStatus;
use App\Models\NewsletterSubscriber;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NewsletterSubscriber>
 */
class NewsletterSubscriberFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<NewsletterSubscriber>
     */
    protected $model = NewsletterSubscriber::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
            'name' => fake()->name(),
            'status' => NewsletterStatus::Subscribed,
            'subscribed_at' => now(),
            'unsubscribed_at' => null,
        ];
    }

    /**
     * Mark the subscriber as unsubscribed.
     */
    public function unsubscribed(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => NewsletterStatus::Unsubscribed,
            'unsubscribed_at' => now(),
        ]);
    }
}
