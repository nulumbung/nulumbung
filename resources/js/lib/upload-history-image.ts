import HistoryController from '@/actions/App/Http/Controllers/HistoryController';

export function uploadHistoryImage(file: File): Promise<string> {
    const form = new FormData();
    form.append('image', file);

    const xsrf = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

    return fetch(HistoryController.uploadImage().url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'X-XSRF-TOKEN': xsrf ? decodeURIComponent(xsrf) : '',
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