<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:manage-users'])->group(function () {
    Route::get('management/users', [UserController::class, 'index'])->name('management.users.index');
    Route::get('management/users/create', [UserController::class, 'create'])->name('management.users.create');
    Route::post('management/users', [UserController::class, 'store'])->name('management.users.store');
    Route::get('management/users/{user}', [UserController::class, 'show'])->name('management.users.show');
    Route::get('management/users/{user}/edit', [UserController::class, 'edit'])->name('management.users.edit');
    Route::patch('management/users/{user}', [UserController::class, 'update'])->name('management.users.update');
    Route::delete('management/users/{user}', [UserController::class, 'destroy'])->name('management.users.destroy');
});
