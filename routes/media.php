<?php

use App\Http\Controllers\MediaController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:manage-media'])->group(function () {
    Route::get('management/media', [MediaController::class, 'index'])->name('management.media.index');
    Route::get('management/media/create', [MediaController::class, 'create'])->name('management.media.create');
    Route::get('management/media/{media}', [MediaController::class, 'show'])->name('management.media.show');
    Route::get('management/media/{media}/edit', [MediaController::class, 'edit'])->name('management.media.edit');
    Route::post('management/media', [MediaController::class, 'store'])->name('management.media.store');
    Route::post('management/media/upload-file', [MediaController::class, 'uploadFile'])->name('management.media.upload-file');
    Route::post('management/media/upload-thumbnail', [MediaController::class, 'uploadThumbnail'])->name('management.media.upload-thumbnail');
    Route::patch('management/media/{media}', [MediaController::class, 'update'])->name('management.media.update');
    Route::delete('management/media/{media}', [MediaController::class, 'destroy'])->name('management.media.destroy');
});
