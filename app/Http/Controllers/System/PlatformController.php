<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\PlatformUpdateRequest;
use App\Mail\TestEmail;
use App\Models\PlatformSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class PlatformController extends Controller
{
    /**
     * Show the platform settings page.
     */
    public function edit(): Response
    {
        return Inertia::render('admin/system/platform', [
            'platform' => PlatformSetting::current(),
        ]);
    }

    /**
     * Update the platform settings.
     */
    public function update(PlatformUpdateRequest $request): RedirectResponse
    {
        $settings = PlatformSetting::current();

        if ($request->has('brand_name')) {
            $settings->brand_name = $request->string('brand_name')->trim()->toString() ?: null;
        }

        if ($request->has('tagline')) {
            $settings->tagline = $request->string('tagline')->trim()->toString() ?: null;
        }

        if ($request->hasFile('logo')) {
            $settings->logo = $this->storeAsDataUrl($request->file('logo'));
        }

        if ($request->hasFile('favicon')) {
            $settings->favicon = $this->storeAsDataUrl($request->file('favicon'));
        }

        if ($request->has('mail_mailer')) {
            $settings->mail_mailer = $request->string('mail_mailer')->trim()->toString() ?: null;
        }

        if ($request->has('mail_host')) {
            $settings->mail_host = $request->string('mail_host')->trim()->toString() ?: null;
        }

        if ($request->has('mail_port')) {
            $settings->mail_port = $request->filled('mail_port') ? $request->integer('mail_port') : null;
        }

        if ($request->has('mail_scheme')) {
            $settings->mail_scheme = $request->string('mail_scheme')->trim()->toString() ?: null;
        }

        if ($request->has('mail_username')) {
            $settings->mail_username = $request->string('mail_username')->trim()->toString() ?: null;
        }

        if ($request->has('mail_password')) {
            $settings->mail_password = $request->string('mail_password')->trim()->toString() ?: null;
        }

        if ($request->has('mail_from_address')) {
            $settings->mail_from_address = $request->string('mail_from_address')->trim()->toString() ?: null;
        }

        if ($request->has('mail_from_name')) {
            $settings->mail_from_name = $request->string('mail_from_name')->trim()->toString() ?: null;
        }

        if ($request->has('contact_email')) {
            $settings->contact_email = $request->string('contact_email')->trim()->toString() ?: null;
        }

        if ($request->has('contact_phone')) {
            $settings->contact_phone = $request->string('contact_phone')->trim()->toString() ?: null;
        }

        if ($request->has('contact_whatsapp')) {
            $settings->contact_whatsapp = $request->string('contact_whatsapp')->trim()->toString() ?: null;
        }

        if ($request->has('contact_address')) {
            $settings->contact_address = $request->string('contact_address')->trim()->toString() ?: null;
        }

        if ($request->has('social_facebook')) {
            $settings->social_facebook = $request->string('social_facebook')->trim()->toString() ?: null;
        }

        if ($request->has('social_instagram')) {
            $settings->social_instagram = $request->string('social_instagram')->trim()->toString() ?: null;
        }

        if ($request->has('social_youtube')) {
            $settings->social_youtube = $request->string('social_youtube')->trim()->toString() ?: null;
        }

        $settings->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Platform settings updated.']);

        return to_route('system.platform.edit');
    }

    /**
     * Send a test email to verify the configured SMTP connection.
     */
    public function testEmail(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'test_email' => ['required', 'email', 'max:255'],
        ]);

        PlatformSetting::current()->applyMailConfiguration();

        try {
            Mail::to($data['test_email'])->send(new TestEmail('Test email'));
        } catch (\Throwable $exception) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Failed to send test email: '.$exception->getMessage(),
            ]);

            return back();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Test email sent.']);

        return back();
    }

    /**
     * Convert an uploaded image into a base64 data URI stored in the database.
     */
    private function storeAsDataUrl(UploadedFile $file): string
    {
        return sprintf('data:%s;base64,%s', $file->getMimeType(), base64_encode($file->getContent()));
    }
}
