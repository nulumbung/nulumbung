import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Clock,
    Eye,
    Filter,
    Flame,
    ImageIcon,
    Mail,
    Newspaper,
    Pencil,
    Plus,
    Search,
    Trash2,
    TrendingUp,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import NewsController from '@/actions/App/Http/Controllers/NewsController';
import { NewsFormFields } from '@/components/news-form';
import Pagination, { Paginator } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { index, show } from '@/routes/management/news';
import {
    editFormData,
    emptyForm,
    formatPublishDate,
    PLACEMENTS,
    STATUS_OPTIONS,
    toWireDateTime,
} from '@/lib/news';
import type { CategoryOption, NewsFormData, NewsItem } from '@/lib/news';

type PageProps = {
    news: Paginator<NewsItem>;
    categories: CategoryOption[];
    filters: { search: string | null; status: string | null };
    timezone: string;
};

export default function NewsIndex({ news, categories, filters, timezone }: PageProps) {
    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [statusValue, setStatusValue] = useState(filters.status ?? '');
    const [creatingOpen, setCreatingOpen] = useState(false);
    const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
    const [deletingNews, setDeletingNews] = useState<NewsItem | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = {
                search: searchValue || undefined,
                status: statusValue || undefined,
            };

            if (
                searchValue !== (filters.search ?? '') ||
                statusValue !== (filters.status ?? '')
            ) {
                router.get(index(), params, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                });
            }
        }, 400);

        return () => clearTimeout(timer);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue, statusValue]);

    return (
        <>
            <Head title="News" />

            <h1 className="sr-only">News</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full rounded-xl">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                            <CardTitle>News</CardTitle>
                            <CardDescription>
                                Write, publish and manage news articles
                            </CardDescription>
                        </div>
                        <Button
                            className="hidden sm:inline-flex"
                            onClick={() => setCreatingOpen(true)}
                        >
                            <Plus className="size-4" />
                            Add news
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 sm:hidden">
                            <Button
                                className="w-full"
                                onClick={() => setCreatingOpen(true)}
                            >
                                <Plus className="size-4" />
                                Add news
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative flex-1 sm:max-w-sm">
                                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                                <Input
                                    name="search"
                                    value={searchValue}
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
                                    placeholder="Search news..."
                                    className="pl-9"
                                    autoComplete="off"
                                />
                            </div>

                            <StatusFilter
                                value={statusValue}
                                onChange={setStatusValue}
                                className="hidden sm:flex"
                            />
                            <StatusFilterMobile
                                value={statusValue}
                                onChange={setStatusValue}
                                className="sm:hidden"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-border border-b">
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Title
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Category
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Status
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Publish date
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Placement
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-right font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {news.data.map((item) => (
                                        <NewsRow
                                            key={item.id}
                                            news={item}
                                            timezone={timezone}
                                            onEdit={() => setEditingNews(item)}
                                            onDelete={() =>
                                                setDeletingNews(item)
                                            }
                                        />
                                    ))}
                                    {news.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="text-muted-foreground px-3 py-8 text-center"
                                            >
                                                No news found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination paginator={news} />
                    </CardContent>
                </Card>
            </div>

            <CreateNewsDialog
                open={creatingOpen}
                onOpenChange={setCreatingOpen}
                categories={categories}
                timezone={timezone}
            />

            <EditNewsDialog
                news={editingNews}
                categories={categories}
                timezone={timezone}
                onClose={() => setEditingNews(null)}
            />

            <DeleteNewsDialog
                news={deletingNews}
                onClose={() => setDeletingNews(null)}
            />
        </>
    );
}

function NewsRow({
    news,
    timezone,
    onEdit,
    onDelete,
}: {
    news: NewsItem;
    timezone: string;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <tr className="border-border border-b last:border-0">
            <td className="px-3 py-3">
                <div className="flex items-center gap-3">
                    {news.image_url ? (
                        <img
                            src={news.image_url}
                            alt={news.title}
                            className="bg-muted size-10 shrink-0 rounded-md object-cover"
                        />
                    ) : (
                        <span className="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-md">
                            <ImageIcon className="size-4" />
                        </span>
                    )}
                    <Link
                        href={show(news.id)}
                        className="hover:text-foreground line-clamp-2 max-w-64 font-medium hover:underline"
                    >
                        {news.title}
                    </Link>
                </div>
            </td>
            <td className="text-muted-foreground px-3 py-3">
                {news.category?.name ?? '-'}
            </td>
            <td className="px-3 py-3">
                <StatusBadge status={news.status} />
            </td>
            <td className="text-muted-foreground px-3 py-3">
                {news.publish_at
                    ? formatPublishDate(news.publish_at, timezone)
                    : '-'}
            </td>
            <td className="px-3 py-3">
                <PlacementBadges news={news} />
            </td>
            <td className="px-3 py-3">
                <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                        <Link
                            href={show(news.id)}
                            aria-label={`View ${news.title}`}
                        >
                            <Eye className="size-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onEdit}
                        aria-label={`Edit ${news.title}`}
                    >
                        <Pencil className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDelete}
                        aria-label={`Delete ${news.title}`}
                        className="hover:text-destructive"
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </td>
        </tr>
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

function StatusFilter({
    value,
    onChange,
    className,
}: {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}) {
    return (
        <div className={className}>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-[130px] gap-2 sm:w-[150px]">
                    <Filter className="text-muted-foreground size-4 shrink-0" />
                    <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

function StatusFilterMobile({
    value,
    onChange,
    className,
}: {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}) {
    return (
        <div className={className}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" aria-label="Filter">
                        <Filter className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[160px]">
                    <DropdownMenuItem
                        onSelect={() => onChange('')}
                        className={value === '' ? 'bg-accent' : ''}
                    >
                        All statuses
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {STATUS_OPTIONS.map((option) => (
                        <DropdownMenuItem
                            key={option.value}
                            onSelect={() => onChange(option.value)}
                            className={value === option.value ? 'bg-accent' : ''}
                        >
                            {option.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

function PlacementBadges({ news }: { news: NewsItem }) {
    const active = PLACEMENTS.filter((placement) => news[placement.key]);

    if (active.length === 0) {
        return <span className="text-muted-foreground">-</span>;
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

function CreateNewsDialog({
    open,
    onOpenChange,
    categories,
    timezone,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categories: CategoryOption[];
    timezone: string;
}) {
    const form = useForm<NewsFormData>(emptyForm(timezone));

    useEffect(() => {
        if (form.wasSuccessful) {
            form.reset();
            form.clearErrors();
            onOpenChange(false);
        }
    }, [form.wasSuccessful]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            publish_at: toWireDateTime(data.publish_at),
        }));
        form.submit(NewsController.store());
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                onOpenChange(open);
                if (!open) {
                    form.reset();
                    form.clearErrors();
                }
            }}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Create news</DialogTitle>
                    <DialogDescription>
                        Add a new news article to the platform
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6">
                    <NewsFormFields
                        form={form}
                        categories={categories}
                        titlePrefix="create"
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
                            Create news
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditNewsDialog({
    news,
    categories,
    timezone,
    onClose,
}: {
    news: NewsItem | null;
    categories: CategoryOption[];
    timezone: string;
    onClose: () => void;
}) {
    const form = useForm<NewsFormData>(editFormData(news, timezone));

    useEffect(() => {
        if (news) {
            form.setData(editFormData(news, timezone));
            form.clearErrors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [news?.id]);

    useEffect(() => {
        if (form.wasSuccessful) {
            form.reset();
            form.clearErrors();
            onClose();
        }
    }, [form.wasSuccessful]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (news) {
            form.transform((data) => ({
                ...data,
                publish_at: toWireDateTime(data.publish_at),
            }));
            form.submit(NewsController.update(news));
        }
    };

    return (
        <Dialog
            open={news !== null}
            onOpenChange={(open) => {
                if (!open) {
                    form.reset();
                    form.clearErrors();
                    onClose();
                }
            }}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit news</DialogTitle>
                    <DialogDescription>
                        Update the news article information
                    </DialogDescription>
                </DialogHeader>

                {news && (
                    <form onSubmit={onSubmit} className="space-y-6">
                        <NewsFormFields
                            form={form}
                            categories={categories}
                            titlePrefix="edit"
                        />

                        <DialogFooter className="flex-row justify-end gap-2 [&>button]:flex-1 sm:[&>button]:flex-none">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    form.reset();
                                    form.clearErrors();
                                    onClose();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}

function DeleteNewsDialog({
    news,
    onClose,
}: {
    news: NewsItem | null;
    onClose: () => void;
}) {
    const form = useForm<Record<string, never>>({});

    useEffect(() => {
        if (form.wasSuccessful) {
            form.reset();
            form.clearErrors();
            onClose();
        }
    }, [form.wasSuccessful]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (news) {
            form.submit(NewsController.destroy(news));
        }
    };

    return (
        <Dialog
            open={news !== null}
            onOpenChange={(open) => {
                if (!open) {
                    form.reset();
                    form.clearErrors();
                    onClose();
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete news</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this news article? This
                        action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {news && (
                    <>
                        <div className="flex items-center gap-3 rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-200/10 dark:bg-red-700/10 dark:text-red-100">
                            {news.image_url && (
                                <img
                                    src={news.image_url}
                                    alt=""
                                    className="size-10 rounded object-cover"
                                />
                            )}
                            <span className="line-clamp-2 font-medium">
                                {news.title}
                            </span>
                        </div>

                        <form onSubmit={onSubmit}>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        form.reset();
                                        form.clearErrors();
                                        onClose();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={form.processing}
                                >
                                    Delete news
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

NewsIndex.layout = {
    breadcrumbs: [
        {
            title: 'News',
            href: index(),
        },
    ],
};