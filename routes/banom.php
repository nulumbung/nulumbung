<?php

use App\Http\Controllers\BanomController;
use App\Http\Controllers\BanomOfficerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:manage-banom'])->group(function () {
    Route::get('management/banom', [BanomController::class, 'index'])->name('management.banom.index');
    Route::get('management/banom/create', [BanomController::class, 'create'])->name('management.banom.create');
    Route::get('management/banom/{banom}/edit', [BanomController::class, 'edit'])->name('management.banom.edit');
    Route::post('management/banom', [BanomController::class, 'store'])->name('management.banom.store');
    Route::post('management/banom/upload-image', [BanomController::class, 'uploadImage'])->name('management.banom.upload-image');
    Route::patch('management/banom/{banom}', [BanomController::class, 'update'])->name('management.banom.update');
    Route::delete('management/banom/{banom}', [BanomController::class, 'destroy'])->name('management.banom.destroy');

    Route::get('management/banom/{banom}/officers', [BanomOfficerController::class, 'index'])->name('management.banom.officers.index');
    Route::post('management/banom/{banom}/officers', [BanomOfficerController::class, 'store'])->name('management.banom.officers.store');
    Route::patch('management/banom/{banom}/officers/{officer}', [BanomOfficerController::class, 'update'])->name('management.banom.officers.update');
    Route::delete('management/banom/{banom}/officers/{officer}', [BanomOfficerController::class, 'destroy'])->name('management.banom.officers.destroy');
});
