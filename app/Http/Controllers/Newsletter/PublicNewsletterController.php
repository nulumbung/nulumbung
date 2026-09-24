<?php

namespace App\Http\Controllers\Newsletter;

use App\Enums\NewsletterStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Newsletter\NewsletterSubscribeRequest;
use App\Models\NewsletterSubscriber;
use App\Models\PlatformSetting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PublicNewsletterController extends Controller
{
    /**
     * Show the public newsletter page.
     */
    public function show(): Response
    {
        return Inertia::render('public/newsletter', [
            'platform' => PlatformSetting::current(),
            'newsletter_notice' => session('newsletter_notice'),
        ]);
    }

    /**
     * Subscribe a public email to the newsletter.
     */
    public function subscribe(NewsletterSubscribeRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $subscriber = NewsletterSubscriber::where('email', $data['email'])->first();

        if ($subscriber && $subscriber->status === NewsletterStatus::Subscribed) {
            $message = 'You are already subscribed to the newsletter.';
        } else {
            NewsletterSubscriber::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'] ?? null,
                    'status' => NewsletterStatus::Subscribed->value,
                    'subscribed_at' => now(),
                    'unsubscribed_at' => null,
                ],
            );

            $message = 'You have subscribed to the newsletter.';
        }

        session(['newsletter_notice' => ['type' => 'success', 'message' => $message]]);

        return redirect()->back(302, [], route('newsletter.show'));
    }

    /**
     * Unsubscribe using the personal token included in newsletter emails.
     */
    public function unsubscribe(string $token): RedirectResponse
    {
        $subscriber = NewsletterSubscriber::where('token', $token)->firstOrFail();

        $subscriber->update([
            'status' => NewsletterStatus::Unsubscribed->value,
            'unsubscribed_at' => now(),
        ]);

        session(['newsletter_notice' => ['type' => 'success', 'message' => 'You have unsubscribed from the newsletter.']]);

        return redirect()->route('newsletter.show');
    }
}
