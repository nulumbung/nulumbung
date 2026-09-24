import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export type Paginator<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    path: string;
};

export default function Pagination({
    paginator,
}: {
    paginator: Paginator<unknown>;
}) {
    if (paginator.last_page <= 1) {
        return null;
    }

    const numericLinks = paginator.links.filter((link) =>
        /^\d+$/.test(link.label),
    );

    return (
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p className="text-muted-foreground text-sm">
                Showing {paginator.from ?? 0} to {paginator.to ?? 0} of{' '}
                {paginator.total}
            </p>

            <nav className="flex items-center gap-1">
                {numericLinks.map((link, index) => (
                    <Button
                        key={`${link.label}-${index}`}
                        variant={link.active ? 'default' : 'ghost'}
                        size="icon"
                        disabled={link.active}
                        asChild={!link.active && link.url !== null}
                    >
                        {link.url !== null && !link.active ? (
                            <Link href={link.url} preserveScroll>
                                {link.label}
                            </Link>
                        ) : (
                            <span aria-hidden="true">{link.label}</span>
                        )}
                    </Button>
                ))}
            </nav>
        </div>
    );
}