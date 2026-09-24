import type { useForm } from '@inertiajs/react';

export type NewsletterSubscriber = {
    id: string;
    email: string;
    name: string | null;
    status: string;
    subscribed_at: string | null;
    unsubscribed_at: string | null;
};

export type NewsletterSubscriberFormData = {
    email: string;
    name: string;
    status: string;
};

export const STATUS_OPTIONS = [
    { value: 'subscribed', label: 'Subscribed' },
    { value: 'unsubscribed', label: 'Unsubscribed' },
] as const;

export const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive'> = {
    subscribed: 'default',
    unsubscribed: 'secondary',
};

export type NewsletterNews = {
    id: string;
    title: string;
    image_url: string | null;
    status: string;
    publisher: string | null;
    publish_at: string | null;
    is_newsletter: boolean;
    newsletter_sent_at: string | null;
};

export type NewsletterForm = ReturnType<typeof useForm<NewsletterSubscriberFormData>>;

export function emptyForm(): NewsletterSubscriberFormData {
    return {
        email: '',
        name: '',
        status: 'subscribed',
    };
}

export function editFormData(
    subscriber: NewsletterSubscriber | null,
): NewsletterSubscriberFormData {
    return {
        email: subscriber?.email ?? '',
        name: subscriber?.name ?? '',
        status: subscriber?.status ?? 'subscribed',
    };
}

export function wireForm(form: NewsletterForm): void {
    form.transform(() => ({
        email: form.data.email.trim(),
        name: form.data.name.trim() || null,
        status: form.data.status,
    }));
}