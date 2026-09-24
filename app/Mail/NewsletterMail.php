<?php

namespace App\Mail;

use App\Models\News;
use App\Models\NewsletterSubscriber;
use App\Models\PlatformSetting;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        public News $news,
        public ?NewsletterSubscriber $subscriber = null,
        public ?string $unsubscribeUrl = null,
        public ?string $brandName = null,
    ) {
        $this->brandName ??= PlatformSetting::current()->brand_name ?: (string) config('app.name');
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "{$this->brandName} - {$this->news->title}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail.newsletter',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
