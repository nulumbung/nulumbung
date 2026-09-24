<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('profile.edit'));

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'whatsapp' => '+6281234567890',
            'address' => 'Jl. Merdeka No. 1, Jakarta',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->name)->toBe('Test User');
    expect($user->email)->toBe('test@example.com');
    expect($user->whatsapp)->toBe('+6281234567890');
    expect($user->address)->toBe('Jl. Merdeka No. 1, Jakarta');
    expect($user->email_verified_at)->toBeNull();
});

test('profile avatar can be updated and is stored in the database', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'avatar' => UploadedFile::fake()->image('avatar.png', 100, 100)->mimeType('image/png'),
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    $storedAvatar = $user->getRawOriginal('avatar');

    expect($storedAvatar)->not->toBeNull();
    expect(base64_decode((string) $storedAvatar, true))->not->toBeEmpty();
    expect($user->avatar)->toBe(route('user.avatar', $user));
});

test('profile avatar is served from the database', function () {
    $user = User::factory()->create([
        'avatar' => base64_encode((string) UploadedFile::fake()->image('avatar.png', 100, 100)->get()),
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('user.avatar', $user));

    $response->assertOk();
    expect($response->headers->get('Content-Type'))->toBe('image/png');
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => $user->email,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('user can delete their account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->delete(route('profile.destroy'), [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('home'));

    $this->assertGuest();
    expect($user->fresh())->toBeNull();
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('profile.edit'))
        ->delete(route('profile.destroy'), [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect(route('profile.edit'));

    expect($user->fresh())->not->toBeNull();
});
