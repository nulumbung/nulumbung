import MediaController from '@/actions/App/Http/Controllers/MediaController';

function xsrfToken(): string {
    const xsrf = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

    return xsrf ? decodeURIComponent(xsrf) : '';
}

function upload(url: string, field: string, file: File): Promise<string> {
    const form = new FormData();
    form.append(field, file);

    return fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'X-XSRF-TOKEN': xsrfToken(),
        },
        body: form,
    }).then(async (response) => {
        if (!response.ok) {
            throw new Error(`Upload failed with status ${response.status}`);
        }

        const data = (await response.json()) as { path: string };

        return data.path;
    });
}

export function uploadMediaFile(file: File): Promise<string> {
    return upload(MediaController.uploadFile().url, 'file', file);
}

export function uploadMediaThumbnail(file: File): Promise<string> {
    return upload(MediaController.uploadThumbnail().url, 'thumbnail', file);
}

export function storageUrl(path: string): string {
    return `/storage/${path}`;
}