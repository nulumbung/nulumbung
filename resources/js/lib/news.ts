import { Clock, Flame, Mail, Newspaper, TrendingUp } from 'lucide-react';
import type { useForm } from '@inertiajs/react';

export type CategoryOption = { id: string; name: string };

export type NewsItem = {
    id: string;
    title: string;
    slug: string;
    image: string | null;
    image_url: string | null;
    image_caption: string | null;
    description: string | null;
    category: CategoryOption | null;
    publish_at: string | null;
    status: string;
    publisher: string | null;
    is_headline: boolean;
    is_trending: boolean;
    is_popular: boolean;
    is_latest: boolean;
    is_newsletter: boolean;
};

export type NewsFormData = {
    title: string;
    slug: string;
    image: string;
    image_caption: string;
    description: string;
    category_id: string;
    publish_at: string;
    status: string;
    is_headline: boolean;
    is_trending: boolean;
    is_popular: boolean;
    is_latest: boolean;
    is_newsletter: boolean;
};

export const PLACEMENTS = [
    { key: 'is_headline', icon: Newspaper, label: 'Headline news' },
    { key: 'is_trending', icon: TrendingUp, label: 'Trending topic' },
    { key: 'is_popular', icon: Flame, label: 'Popular' },
    { key: 'is_latest', icon: Clock, label: 'Latest news' },
    { key: 'is_newsletter', icon: Mail, label: 'Newsletter' },
] as const;

export const STATUS_OPTIONS = [
    { value: 'publish', label: 'Publish' },
    { value: 'archive', label: 'Archive' },
    { value: 'draft', label: 'Draft' },
] as const;

export type NewsForm = ReturnType<typeof useForm<NewsFormData>>;

export function toLocalInput(
    value: string | null | undefined,
    timezone: string,
): string {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(date);

    const get = (type: string) =>
        parts.find((part) => part.type === type)?.value ?? '';

    return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

export function toWireDateTime(value: string): string {
    if (!value) {
        return '';
    }

    return `${value.replace('T', ' ')}:00`;
}

export function formatPublishDate(
    value: string | null | undefined,
    timezone: string,
): string {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return new Intl.DateTimeFormat(undefined, {
        timeZone: timezone,
        dateStyle: 'medium',
        timeStyle: 'short',
        hourCycle: 'h23',
    }).format(date);
}

export function toSlug(value: string): string {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export function emptyForm(timezone: string): NewsFormData {
    return {
        title: '',
        slug: '',
        image: '',
        image_caption: '',
        description: '',
        category_id: '',
        publish_at: toLocalInput(new Date().toISOString(), timezone),
        status: 'draft',
        is_headline: false,
        is_trending: false,
        is_popular: false,
        is_latest: false,
        is_newsletter: false,
    };
}

export function editFormData(news: NewsItem | null, timezone: string): NewsFormData {
    if (!news) {
        return emptyForm(timezone);
    }

    return {
        title: news.title,
        slug: news.slug,
        image: news.image ?? '',
        image_caption: news.image_caption ?? '',
        description: news.description ?? '',
        category_id: news.category?.id ?? '',
        publish_at: toLocalInput(news.publish_at, timezone),
        status: news.status,
        is_headline: news.is_headline,
        is_trending: news.is_trending,
        is_popular: news.is_popular,
        is_latest: news.is_latest,
        is_newsletter: news.is_newsletter,
    };
}