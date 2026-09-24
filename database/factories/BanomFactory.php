<?php

namespace Database\Factories;

use App\Models\Banom;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Banom>
 */
class BanomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(2, true),
            'tagline' => fake()->sentence(),
            'logo' => null,
            'description' => fake()->paragraph(),
            'sort_order' => fake()->unique()->numberBetween(1, 100),
        ];
    }
}
