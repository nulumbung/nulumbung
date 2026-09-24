import { Link } from '@inertiajs/react';
import AppBrand from '@/components/app-brand';
import { Card, CardContent } from '@/components/ui/card';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <AppBrand />
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-base font-medium">{title}</h1>
                            <p className="text-center text-xs text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardContent>{children}</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
