<?php

use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:manage-roles'])->group(function () {
    Route::get('management/roles', [RoleController::class, 'index'])->name('management.roles.index');
    Route::get('management/roles/create', [RoleController::class, 'create'])->name('management.roles.create');
    Route::post('management/roles', [RoleController::class, 'store'])->name('management.roles.store');
    Route::get('management/roles/{role}', [RoleController::class, 'show'])->name('management.roles.show');
    Route::get('management/roles/{role}/edit', [RoleController::class, 'edit'])->name('management.roles.edit');
    Route::patch('management/roles/{role}', [RoleController::class, 'update'])->name('management.roles.update');
    Route::delete('management/roles/{role}', [RoleController::class, 'destroy'])->name('management.roles.destroy');
});
