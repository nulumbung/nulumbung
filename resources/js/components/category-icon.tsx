import { Folder } from 'lucide-react';
import { icons } from '@/components/icon-picker-icons';
import { cn } from '@/lib/utils';

export function CategoryIcon({
    name,
    className,
}: {
    name?: string | null;
    className?: string;
}) {
    const Icon = name ? icons[name] : undefined;

    if (!Icon) {
        return <Folder className={cn('size-4', className)} />;
    }

    return <Icon className={cn('size-4', className)} />;
}