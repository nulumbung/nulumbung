<?php

use App\Http\Controllers\AvatarController;
use App\Http\Controllers\Newsletter\PublicNewsletterController;
use Illuminate\Support\Facades\Route;

Route::get('users/{user}/avatar', [AvatarController::class, 'show'])->name('user.avatar');

Route::inertia('/', 'public/welcome')->name('home');

Route::controller(PublicNewsletterController::class)->group(function () {
    Route::get('newsletter', 'show')->name('newsletter.show');
    Route::post('newsletter/subscribe', 'subscribe')->middleware('throttle:5,1')->name('newsletter.subscribe');
    Route::get('newsletter/unsubscribe/{token}', 'unsubscribe')->name('newsletter.unsubscribe');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'admin/dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/system.php';
require __DIR__.'/users.php';
require __DIR__.'/roles.php';
require __DIR__.'/permissions.php';
require __DIR__.'/categories.php';
require __DIR__.'/news.php';
require __DIR__.'/media.php';
require __DIR__.'/history.php';
require __DIR__.'/banom.php';
require __DIR__.'/newsletter.php';
