import type { useForm } from '@inertiajs/react';

export type BanomItem = {
    id: string;
    name: string;
    tagline: string | null;
    logo: string | null;
    logo_url: string | null;
    description: string | null;
    sort_order: number;
    created_at: string;
};

export type BanomFormData = {
    name: string;
    tagline: string;
    logo: string;
    description: string;
    sort_order: string;
};

export type BanomForm = ReturnType<typeof useForm<BanomFormData>>;

export function emptyBanomForm(): BanomFormData {
    return {
        name: '',
        tagline: '',
        logo: '',
        description: '',
        sort_order: '',
    };
}

export function editBanomFormData(banom: BanomItem | null): BanomFormData {
    if (!banom) {
        return emptyBanomForm();
    }

    return {
        name: banom.name,
        tagline: banom.tagline ?? '',
        logo: banom.logo ?? '',
        description: banom.description ?? '',
        sort_order: String(banom.sort_order),
    };
}

export function wireBanomForm(form: BanomForm): void {
    form.transform((data) => ({
        ...data,
        sort_order: data.sort_order === '' ? 0 : Number(data.sort_order),
    }));
}

export type OfficerPosition = 'ketua' | 'sekretaris' | 'bendahara';
export type OfficerStatus = 'aktif' | 'demisioner';

export type BanomOfficerItem = {
    id: string;
    banom_id: string;
    photo: string | null;
    photo_url: string | null;
    name: string;
    position: OfficerPosition;
    period: string | null;
    status: OfficerStatus;
    created_at: string;
};

export type BanomOfficerFormData = {
    photo: string;
    name: string;
    position: string;
    period: string;
    status: string;
};

export const POSITION_OPTIONS = [
    { value: 'ketua', label: 'Chairman' },
    { value: 'sekretaris', label: 'Secretary' },
    { value: 'bendahara', label: 'Treasurer' },
] as const;

export const OFFICER_STATUS_OPTIONS = [
    { value: 'aktif', label: 'Active' },
    { value: 'demisioner', label: 'Demisioner' },
] as const;