<?php

use App\Http\Controllers\NewsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:manage-news'])->group(function () {
    Route::get('management/news', [NewsController::class, 'index'])->name('management.news.index');
    Route::get('management/news/create', [NewsController::class, 'create'])->name('management.news.create');
    Route::get('management/news/{news}', [NewsController::class, 'show'])->name('management.news.show');
    Route::get('management/news/{news}/edit', [NewsController::class, 'edit'])->name('management.news.edit');
    Route::post('management/news', [NewsController::class, 'store'])->name('management.news.store');
    Route::post('management/news/upload-image', [NewsController::class, 'uploadImage'])->name('management.news.upload-image');
    Route::patch('management/news/{news}', [NewsController::class, 'update'])->name('management.news.update');
    Route::delete('management/news/{news}', [NewsController::class, 'destroy'])->name('management.news.destroy');
});
