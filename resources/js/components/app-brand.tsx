import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';
import { cn } from '@/lib/utils';
import type { PlatformSetting } from '@/types';

type AppBrandProps = {
    className?: string;
    iconClassName?: string;
    showName?: boolean;
    showTagline?: boolean;
};

export default function AppBrand({
    className,
    iconClassName,
    showName = true,
    showTagline = true,
}: AppBrandProps) {
    const { name, platform } = usePage().props as {
        name: string;
        platform?: PlatformSetting | null;
    };

    const brandName = platform?.brand_name ?? name;

    return (
        <div className={cn('flex flex-col items-center gap-2', className)}>
            {platform?.logo ? (
                <img
                    src={platform.logo}
                    alt={brandName}
                    className={cn(
                        'size-16 rounded-lg object-contain',
                        iconClassName,
                    )}
                />
            ) : (
                <div
                    className={cn(
                        'bg-sidebar-primary flex size-15 items-center justify-center rounded-md',
                        iconClassName,
                    )}
                >
                    <AppLogoIcon className="text-sidebar-primary-foreground size-10 fill-current" />
                </div>
            )}

            {showName && (
                <span className="text-lg font-semibold text-foreground">
                    {brandName}
                </span>
            )}

            {showTagline && platform?.tagline && (
                <span className="-mt-1 text-xs text-muted-foreground">
                    {platform.tagline}
                </span>
            )}
        </div>
    );
}