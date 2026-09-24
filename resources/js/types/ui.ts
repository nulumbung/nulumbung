import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types/navigation';

export type AppLayoutProps = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};

export type AppVariant = 'header' | 'sidebar';

export type FlashToast = {
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
};

export type AuthLayoutProps = {
    children?: ReactNode;
    name?: string;
    title?: string;
    description?: string;
};

export type PlatformSetting = {
    id: number;
    brand_name: string | null;
    tagline: string | null;
    logo: string | null;
    favicon: string | null;
    mail_mailer: string | null;
    mail_host: string | null;
    mail_port: number | null;
    mail_scheme: string | null;
    mail_username: string | null;
    mail_password: string | null;
    mail_from_address: string | null;
    mail_from_name: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    contact_whatsapp: string | null;
    contact_address: string | null;
    social_facebook: string | null;
    social_instagram: string | null;
    social_youtube: string | null;
    [key: string]: unknown;
};
