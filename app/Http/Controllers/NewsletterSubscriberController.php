<?php

namespace App\Http\Controllers;

use App\Enums\NewsletterStatus;
use App\Http\Requests\Newsletter\StoreNewsletterSubscriberRequest;
use App\Http\Requests\Newsletter\UpdateNewsletterSubscriberRequest;
use App\Models\News;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsletterSubscriberController extends Controller
{
    /**
     * Display a list of newsletter subscribers with search and pagination.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status')->trim()->toString();

        $subscribers = NewsletterSubscriber::query()
            ->when($search, fn ($query, string $term) => $query
                ->where('email', 'like', "%{$term}%")
                ->orWhere('name', 'like', "%{$term}%"))
            ->when($status, fn ($query, string $value) => $query->where('status', $value))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $newsletterNews = News::query()
            ->where('is_newsletter', true)
            ->latest('publish_at')
            ->limit(10)
            ->get();

        return Inertia::render('admin/newsletter/index', [
            'subscribers' => $subscribers,
            'newsletter_news' => $newsletterNews,
            'subscribed_count' => NewsletterSubscriber::query()
                ->where('status', NewsletterStatus::Subscribed->value)
                ->count(),
            'filters' => ['search' => $search, 'status' => $status],
        ]);
    }

    /**
     * Store a newly created subscriber.
     */
    public function store(StoreNewsletterSubscriberRequest $request): RedirectResponse
    {
        $data = $request->validated();

        NewsletterSubscriber::create([
            ...$data,
            'status' => $data['status'] ?? NewsletterStatus::Subscribed->value,
            'subscribed_at' => now(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Subscriber created.']);

        return back();
    }

    /**
     * Update the given subscriber.
     */
    public function update(UpdateNewsletterSubscriberRequest $request, NewsletterSubscriber $subscriber): RedirectResponse
    {
        $data = $request->validated();
        $status = $data['status'] ?? null;

        $subscriber->fill($data);

        if ($status === NewsletterStatus::Subscribed->value) {
            $subscriber->subscribed_at ??= now();
            $subscriber->unsubscribed_at = null;
        }

        if ($status === NewsletterStatus::Unsubscribed->value) {
            $subscriber->unsubscribed_at ??= now();
        }

        $subscriber->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Subscriber updated.']);

        return back();
    }

    /**
     * Remove the given subscriber.
     */
    public function destroy(Request $request, NewsletterSubscriber $subscriber): RedirectResponse
    {
        $subscriber->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Subscriber deleted.']);

        return back();
    }

    /**
     * Send the given newsletter-marked news to all subscribed subscribers.
     */
    public function send(Request $request, News $news): RedirectResponse
    {
        if (! $news->is_newsletter) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'This news is not marked as a newsletter.']);

            return back();
        }

        $result = $news->sendNewsletter();

        if ($result['total'] === 0) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'No subscribers yet.']);

            return back();
        }

        $news->update(['newsletter_sent_at' => now()]);

        $message = $result['failures'] > 0
            ? "Newsletter sent to {$result['total']} subscriber(s) with {$result['failures']} failure(s)."
            : "Newsletter sent to {$result['total']} subscriber(s).";

        Inertia::flash('toast', [
            'type' => $result['failures'] > 0 ? 'warning' : 'success',
            'message' => $message,
        ]);

        return back();
    }
}
