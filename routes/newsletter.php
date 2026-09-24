<?php

use App\Http\Controllers\NewsletterSubscriberController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:manage-newsletter'])->group(function () {
    Route::get('management/newsletter', [NewsletterSubscriberController::class, 'index'])->name('management.newsletter.index');
    Route::post('management/newsletter', [NewsletterSubscriberController::class, 'store'])->name('management.newsletter.store');
    Route::post('management/newsletter/send/{news}', [NewsletterSubscriberController::class, 'send'])->name('management.newsletter.send');
    Route::patch('management/newsletter/{subscriber}', [NewsletterSubscriberController::class, 'update'])->name('management.newsletter.update');
    Route::delete('management/newsletter/{subscriber}', [NewsletterSubscriberController::class, 'destroy'])->name('management.newsletter.destroy');
});
