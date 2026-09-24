<?php

use App\Http\Controllers\HistoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:manage-history'])->group(function () {
    Route::get('management/history', [HistoryController::class, 'index'])->name('management.history.index');
    Route::get('management/history/create', [HistoryController::class, 'create'])->name('management.history.create');
    Route::get('management/history/{history}', [HistoryController::class, 'show'])->name('management.history.show');
    Route::get('management/history/{history}/edit', [HistoryController::class, 'edit'])->name('management.history.edit');
    Route::post('management/history', [HistoryController::class, 'store'])->name('management.history.store');
    Route::post('management/history/upload-image', [HistoryController::class, 'uploadImage'])->name('management.history.upload-image');
    Route::patch('management/history/{history}', [HistoryController::class, 'update'])->name('management.history.update');
    Route::delete('management/history/{history}', [HistoryController::class, 'destroy'])->name('management.history.destroy');
});
