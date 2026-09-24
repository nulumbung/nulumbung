import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';
import type { PlatformSetting } from '@/types';

export default function AppLogo() {
    const { name, platform } = usePage().props as {
        name: string;
        platform?: PlatformSetting | null;
    };

    return (
        <div className="flex min-w-0 flex-1 items-center gap-2">
            {platform?.logo ? (
                <img
                    src={platform.logo}
                    alt={platform.brand_name ?? name}
                    className="size-12 shrink-0 object-contain"
                />
            ) : (
                <AppLogoIcon className="text-sidebar-foreground size-12 shrink-0 fill-current" />
            )}
            <div className="grid min-w-0 flex-1 text-left text-sm">
                <span className="truncate leading-none font-semibold">
                    {platform?.brand_name ?? name}
                </span>
                {platform?.tagline && (
                    <span className="text-muted-foreground mt-0.5 truncate leading-none text-xs">
                        {platform.tagline}
                    </span>
                )}
            </div>
        </div>
    );
}