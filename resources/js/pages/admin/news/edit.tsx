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
import { edit, index } from '@/routes/management/news';
import { editFormData, toWireDateTime } from '@/lib/news';
import type { CategoryOption, NewsFormData, NewsItem } from '@/lib/news';

export default function NewsEdit({
    news,
    categories,
    timezone,
}: {
    news: NewsItem;
    categories: CategoryOption[];
    timezone: string;
}) {
    const form = useForm<NewsFormData>(editFormData(news, timezone));

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            publish_at: toWireDateTime(data.publish_at),
        }));
        form.submit(NewsController.update(news));
    };

    return (
        <>
            <Head title={`Edit ${news.title}`} />

            <h1 className="sr-only">Edit {news.title}</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-3xl self-center rounded-xl">
                    <CardHeader>
                        <CardTitle>Edit news</CardTitle>
                        <CardDescription>
                            Update the news article information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-6">
                            <NewsFormFields
                                form={form}
                                categories={categories}
                                titlePrefix="edit"
                            />

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    asChild
                                >
                                    <Link href={index()}>Cancel</Link>
                                </Button>
                                <Button disabled={form.processing}>Save</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

NewsEdit.layout = ({ news }: { news: NewsItem }) => ({
    breadcrumbs: [
        {
            title: 'News',
            href: index(),
        },
        {
            title: news.title,
            href: edit(news.id),
        },
        {
            title: 'Edit',
            href: edit(news.id),
        },
    ],
});