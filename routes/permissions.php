<?php

use App\Http\Controllers\PermissionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:manage-permissions'])->group(function () {
    Route::get('management/permissions', [PermissionController::class, 'index'])->name('management.permissions.index');
    Route::patch('management/permissions/{role}', [PermissionController::class, 'update'])->name('management.permissions.update');
});
