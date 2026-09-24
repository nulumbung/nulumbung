<?php

namespace App\Models;

use App\Enums\NewsletterStatus;
use App\Enums\NewsStatus;
use App\Mail\NewsletterMail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Mail;

class News extends Model
{
    use HasFactory, HasUuids;

    /**
     * @var array<string>
     */
    protected $fillable = [
        'id',
        'title',
        'slug',
        'image',
        'image_caption',
        'description',
        'category_id',
        'publish_at',
        'status',
        'publisher',
        'is_headline',
        'is_trending',
        'is_popular',
        'is_latest',
        'is_newsletter',
        'newsletter_sent_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'status' => NewsStatus::class,
        'publish_at' => 'datetime',
        'is_headline' => 'boolean',
        'is_trending' => 'boolean',
        'is_popular' => 'boolean',
        'is_latest' => 'boolean',
        'is_newsletter' => 'boolean',
        'newsletter_sent_at' => 'datetime',
    ];

    /**
     * @var array<string>
     */
    protected $appends = ['image_url'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset('storage/'.$this->image) : null;
    }

    public function getEmailDescriptionAttribute(): string
    {
        return (string) preg_replace_callback(
            '/(src|href)="(\/storage\/[^"]+)"/',
            fn (array $matches): string => sprintf('%s="%s"', $matches[1], asset($matches[2])),
            (string) $this->description,
        );
    }

    /**
     * Send this news as a newsletter to all subscribed subscribers.
     *
     * Applies the persisted SMTP configuration before sending and tracks
     * individual delivery failures per recipient.
     *
     * @return array{total: int, failures: int}
     */
    public function sendNewsletter(): array
    {
        $subscribers = NewsletterSubscriber::query()
            ->where('status', NewsletterStatus::Subscribed->value)
            ->get();

        if ($subscribers->isEmpty()) {
            return ['total' => 0, 'failures' => 0];
        }

        PlatformSetting::current()->applyMailConfiguration();

        $failures = 0;

        foreach ($subscribers as $subscriber) {
            try {
                Mail::to($subscriber->email)->send(new NewsletterMail(
                    $this,
                    $subscriber,
                    route('newsletter.unsubscribe', ['token' => $subscriber->token]),
                ));
            } catch (\Throwable) {
                $failures++;
            }
        }

        return ['total' => $subscribers->count(), 'failures' => $failures];
    }

    /**
     * Automatically deliver the newsletter when this news is first published.
     *
     * Sends once per news: only when marked as newsletter, currently
     * published, and not delivered before.
     */
    public function sendNewsletterIfDue(): void
    {
        if (! $this->is_newsletter || $this->status->value !== NewsStatus::Publish->value || $this->newsletter_sent_at) {
            return;
        }

        $result = $this->sendNewsletter();

        if ($result['total'] > 0) {
            $this->update(['newsletter_sent_at' => now()]);
        }
    }
}
