<?php

namespace Database\Seeders;

use App\Models\PlatformSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlatformSettingSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed default platform settings.
     */
    public function run(): void
    {
        PlatformSetting::firstOrCreate(
            ['id' => 1],
            [
                'brand_name' => config('app.name', 'Laravel'),
                'tagline' => null,
                'logo' => null,
                'favicon' => null,
            ]
        );
    }
}
