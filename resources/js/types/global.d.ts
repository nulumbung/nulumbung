import type { Auth } from '@/types/auth';
import type { PlatformSetting } from '@/types/ui';

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            platform: PlatformSetting;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}