<?php

namespace Database\Factories;

use App\Enums\BanomOfficerStatus;
use App\Enums\BanomPosition;
use App\Models\Banom;
use App\Models\BanomOfficer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BanomOfficer>
 */
class BanomOfficerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'banom_id' => Banom::factory(),
            'photo' => null,
            'name' => fake()->name(),
            'position' => fake()->randomElement(BanomPosition::cases()),
            'period' => '20'.fake()->numberBetween(22, 26).'-'.'20'.fake()->numberBetween(27, 29),
            'status' => BanomOfficerStatus::Aktif->value,
        ];
    }

    /**
     * Mark the officer as demisioner.
     */
    public function demisioner(): static
    {
        return $this->state(fn (): array => [
            'status' => BanomOfficerStatus::Demisioner->value,
        ]);
    }
}
