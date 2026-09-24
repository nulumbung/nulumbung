<?php

use App\Http\Controllers\System\PlatformController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:manage-system'])->group(function () {
    Route::get('system/platform', [PlatformController::class, 'edit'])->name('system.platform.edit');
    Route::patch('system/platform', [PlatformController::class, 'update'])->name('system.platform.update');
    Route::post('system/platform/test-email', [PlatformController::class, 'testEmail'])->name('system.platform.test-email');
});
