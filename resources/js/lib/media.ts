import type { useForm } from '@inertiajs/react';

export type MediaType = 'photo' | 'video';

export type MediaItem = {
    id: string;
    title: string;
    type: MediaType;
    file: string | null;
    url: string | null;
    thumbnail: string | null;
    description: string | null;
    sort_order: number;
    status: string;
    file_url: string | null;
    thumbnail_url: string | null;
    preview_url: string | null;
    created_at: string;
};

export type MediaFormData = {
    title: string;
    type: MediaType;
    file: string;
    url: string;
    thumbnail: string;
    description: string;
    sort_order: string;
    status: string;
};

export type MediaForm = ReturnType<typeof useForm<MediaFormData>>;

export const TYPE_OPTIONS = [
    { value: 'photo', label: 'Photo' },
    { value: 'video', label: 'Video' },
] as const;

export const STATUS_OPTIONS = [
    { value: 'publish', label: 'Publish' },
    { value: 'archive', label: 'Archive' },
    { value: 'draft', label: 'Draft' },
] as const;

export const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
    publish: 'default',
    draft: 'secondary',
    archive: 'outline',
};

export function emptyForm(): MediaFormData {
    return {
        title: '',
        type: 'photo',
        file: '',
        url: '',
        thumbnail: '',
        description: '',
        sort_order: '',
        status: 'draft',
    };
}

export function editFormData(media: MediaItem | null): MediaFormData {
    if (!media) {
        return emptyForm();
    }

    return {
        title: media.title,
        type: media.type,
        file: media.file ?? '',
        url: media.url ?? '',
        thumbnail: media.thumbnail ?? '',
        description: media.description ?? '',
        sort_order: String(media.sort_order),
        status: media.status,
    };
}

export function wireForm(form: MediaForm): void {
    form.transform((data) => ({
        ...data,
        sort_order: data.sort_order === '' ? 0 : Number(data.sort_order),
    }));
}

export function mediaUrl(value: string | null | undefined): string {
    if (!value) {
        return '';
    }

    return /^https?:\/\//.test(value) ? value : `/storage/${value}`;
}

export function youtubeThumbnail(url: string): string | null {
    const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
    );

    return match
        ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
        : null;
}