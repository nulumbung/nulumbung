import { Head, Link } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import NewsController from '@/actions/App/Http/Controllers/NewsController';
import { NewsFormFields } from '@/components/news-form';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { create, index } from '@/routes/management/news';
import { emptyForm, toWireDateTime } from '@/lib/news';
import type { CategoryOption, NewsFormData } from '@/lib/news';

export default function NewsCreate({
    categories,
    timezone,
}: {
    categories: CategoryOption[];
    timezone: string;
}) {
    const form = useForm<NewsFormData>(emptyForm(timezone));

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            publish_at: toWireDateTime(data.publish_at),
        }));
        form.submit(NewsController.store());
    };

    return (
        <>
            <Head title="Create news" />

            <h1 className="sr-only">Create news</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-3xl self-center rounded-xl">
                    <CardHeader>
                        <CardTitle>Create news</CardTitle>
                        <CardDescription>
                            Add a new news article to the platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-6">
                            <NewsFormFields
                                form={form}
                                categories={categories}
                                titlePrefix="create"
                            />

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    asChild
                                >
                                    <Link href={index()}>Cancel</Link>
                                </Button>
                                <Button disabled={form.processing}>
                                    Create news
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

NewsCreate.layout = {
    breadcrumbs: [
        {
            title: 'News',
            href: index(),
        },
        {
            title: 'Create news',
            href: create(),
        },
    ],
};