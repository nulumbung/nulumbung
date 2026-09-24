<?php

namespace Database\Factories;

use App\Models\History;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<History>
 */
class HistoryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<History>
     */
    protected $model = History::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->unique()->sentence(3),
            'year' => (string) fake()->numberBetween(1900, 2025),
            'image' => null,
            'description' => fake()->paragraph(),
            'sort_order' => fake()->unique()->numberBetween(1, 100),
        ];
    }
}
