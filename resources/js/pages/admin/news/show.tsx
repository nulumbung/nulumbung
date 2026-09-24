import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, Pencil, Tag, User } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
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
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { index } from '@/routes/management/news';
import { editFormData, formatPublishDate, PLACEMENTS, toWireDateTime } from '@/lib/news';
import type { CategoryOption, NewsFormData, NewsItem } from '@/lib/news';
import '../../../../css/editor.css';

export default function NewsShow({
    news,
    categories,
    timezone,
}: {
    news: NewsItem;
    categories: CategoryOption[];
    timezone: string;
}) {
    const [editOpen, setEditOpen] = useState(false);
    const publishDate = formatPublishDate(news.publish_at, timezone);

    return (
        <>
            <Head title={news.title} />

            <h1 className="sr-only">{news.title}</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-3xl self-center rounded-xl">
                    <CardHeader className="space-y-4">
                        <div>
                            <Button variant="ghost" asChild className="w-fit gap-2">
                                <Link href={index()}>
                                    <ArrowLeft className="size-4" />
                                    Back to news
                                </Link>
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <StatusBadge status={news.status} />

                            <CardTitle className="text-2xl">
                                {news.title}
                            </CardTitle>

                            <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                {news.category?.name && (
                                    <span className="inline-flex items-center gap-1">
                                        <Tag className="size-3.5" />
                                        {news.category.name}
                                    </span>
                                )}
                                {news.publish_at && (
                                    <span className="inline-flex items-center gap-1">
                                        <CalendarDays className="size-3.5" />
                                        {publishDate}
                                    </span>
                                )}
                                {news.publisher && (
                                    <span className="inline-flex items-center gap-1">
                                        <User className="size-3.5" />
                                        {news.publisher}
                                    </span>
                                )}
                            </CardDescription>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <PlacementBadges news={news} />
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {news.image_url && (
                            <figure className="space-y-2">
                                <img
                                    src={news.image_url}
                                    alt={news.image_caption ?? news.title}
                                    className="bg-muted aspect-video w-full rounded-md object-cover"
                                />
                                {news.image_caption && (
                                    <figcaption className="text-muted-foreground text-center text-sm">
                                        {news.image_caption}
                                    </figcaption>
                                )}
                            </figure>
                        )}

                        {news.description ? (
                            <div className="tiptap">
                                <div
                                    className="ProseMirror"
                                    dangerouslySetInnerHTML={{
                                        __html: news.description,
                                    }}
                                />
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm">
                                No description provided.
                            </p>
                        )}

                        <div className="flex justify-end pt-2">
                            <Button onClick={() => setEditOpen(true)}>
                                <Pencil className="size-4" />
                                Edit news
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <EditNewsDialog
                news={news}
                categories={categories}
                timezone={timezone}
                open={editOpen}
                onOpenChange={setEditOpen}
            />
        </>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'publish') {
        return <Badge>Publish</Badge>;
    }

    if (status === 'archive') {
        return <Badge variant="outline">Archive</Badge>;
    }

    return <Badge variant="secondary">Draft</Badge>;
}

function PlacementBadges({ news }: { news: NewsItem }) {
    const active = PLACEMENTS.filter((placement) => news[placement.key]);

    if (active.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-1">
            {active.map((placement) => {
                const Icon = placement.icon;

                return (
                    <Badge key={placement.key} variant="secondary">
                        <Icon className="size-3" />
                        {placement.label}
                    </Badge>
                );
            })}
        </div>
    );
}

function EditNewsDialog({
    news,
    categories,
    timezone,
    open,
    onOpenChange,
}: {
    news: NewsItem;
    categories: CategoryOption[];
    timezone: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const form = useForm<NewsFormData>(editFormData(news, timezone));

    useEffect(() => {
        form.setData(editFormData(news, timezone));
        form.clearErrors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            publish_at: toWireDateTime(data.publish_at),
        }));
        form.submit(NewsController.update(news));
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                if (!open) {
                    form.reset();
                    form.clearErrors();
                }
                onOpenChange(open);
            }}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit news</DialogTitle>
                    <DialogDescription>
                        Update the news article information
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6">
                    <NewsFormFields
                        form={form}
                        categories={categories}
                        titlePrefix="edit"
                    />

                    <DialogFooter className="flex-row justify-end gap-2 [&>button]:flex-1 sm:[&>button]:flex-none">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    form.reset();
                                    form.clearErrors();
                                }}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={form.processing}>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

NewsShow.layout = ({ news }: { news: NewsItem }) => ({
    breadcrumbs: [
        {
            title: 'News',
            href: index(),
        },
        {
            title: news.title,
            href: news.slug,
        },
    ],
});