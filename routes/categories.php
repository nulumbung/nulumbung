<?php

use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:manage-categories'])->group(function () {
    Route::get('management/categories', [CategoryController::class, 'index'])->name('management.categories.index');
    Route::get('management/categories/create', [CategoryController::class, 'create'])->name('management.categories.create');
    Route::post('management/categories', [CategoryController::class, 'store'])->name('management.categories.store');
    Route::get('management/categories/{category}/edit', [CategoryController::class, 'edit'])->name('management.categories.edit');
    Route::patch('management/categories/{category}', [CategoryController::class, 'update'])->name('management.categories.update');
    Route::delete('management/categories/{category}', [CategoryController::class, 'destroy'])->name('management.categories.destroy');
});
