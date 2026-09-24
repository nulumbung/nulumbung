<?php

use App\Models\PlatformSetting;

test('the public page renders the platform favicon, logo and brand in the head', function () {
    PlatformSetting::current()->update([
        'brand_name' => 'Acme Corp',
        'tagline' => 'Platform Nyata',
        'logo' => 'data:image/png;base64,logo-image',
        'favicon' => 'data:image/png;base64,favicon-image',
    ]);

    $this->get(route('home', absolute: false))
        ->assertOk()
        ->assertSee('<title>Acme Corp</title>', false)
        ->assertSee('href="data:image/png;base64,favicon-image"', false);
});

test('the public page falls back to the app name and default favicon without platform branding', function () {
    PlatformSetting::current()->update([
        'brand_name' => null,
        'logo' => null,
        'favicon' => null,
    ]);

    $this->get(route('home', absolute: false))
        ->assertOk()
        ->assertSee('<title>'.config('app.name').'</title>', false)
        ->assertSee('href="/favicon.ico"', false);
});
