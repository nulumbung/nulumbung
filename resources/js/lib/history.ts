import type { useForm } from '@inertiajs/react';

export type HistoryItem = {
    id: string;
    title: string;
    year: string | null;
    image: string | null;
    description: string | null;
    sort_order: number;
    image_url: string | null;
    created_at: string;
};

export type HistoryFormData = {
    title: string;
    year: string;
    image: string;
    description: string;
    sort_order: string;
};

export type HistoryForm = ReturnType<typeof useForm<HistoryFormData>>;

export function emptyForm(): HistoryFormData {
    return {
        title: '',
        year: '',
        image: '',
        description: '',
        sort_order: '',
    };
}

export function editFormData(history: HistoryItem | null): HistoryFormData {
    if (!history) {
        return emptyForm();
    }

    return {
        title: history.title,
        year: history.year ?? '',
        image: history.image ?? '',
        description: history.description ?? '',
        sort_order: String(history.sort_order),
    };
}

export function wireForm(form: HistoryForm): void {
    form.transform((data) => ({
        ...data,
        sort_order: data.sort_order === '' ? 0 : Number(data.sort_order),
    }));
}