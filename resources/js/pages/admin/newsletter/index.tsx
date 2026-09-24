import { Head, router, useForm } from '@inertiajs/react';
import { Filter, Pencil, Plus, Search, Send, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import NewsletterSubscriberController from '@/actions/App/Http/Controllers/NewsletterSubscriberController';
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
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    STATUS_OPTIONS,
    STATUS_VARIANT,
    emptyForm,
    editFormData,
    wireForm,
} from '@/lib/newsletter';
import type { NewsletterNews, NewsletterSubscriber, NewsletterSubscriberFormData } from '@/lib/newsletter';
import { formatPublishDate } from '@/lib/news';
import { index, destroy, store, update } from '@/routes/management/newsletter';

export default function NewsletterIndex({
    subscribers,
    newsletter_news,
    filters,
    subscribed_count,
}: {
    subscribers: Paginator<NewsletterSubscriber>;
    newsletter_news: NewsletterNews[];
    filters: { search: string | null; status: string | null };
    subscribed_count: number;
}) {
    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [statusValue, setStatusValue] = useState(filters.status ?? '');
    const [createOpen, setCreateOpen] = useState(false);
    const [editingSubscriber, setEditingSubscriber] =
        useState<NewsletterSubscriber | null>(null);
    const [deletingSubscriber, setDeletingSubscriber] =
        useState<NewsletterSubscriber | null>(null);

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
            <Head title="Newsletter" />

            <h1 className="sr-only">Newsletter</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full rounded-xl">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                            <CardTitle>Newsletter</CardTitle>
                            <CardDescription>
                                Manage email subscribers and newsletter delivery (
                                {subscribed_count} subscribed)
                            </CardDescription>
                        </div>
                        <Button
                            className="hidden sm:inline-flex"
                            onClick={() => setCreateOpen(true)}
                        >
                            <Plus className="size-4" />
                            Add subscriber
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 sm:hidden">
                            <Button
                                className="w-full"
                                onClick={() => setCreateOpen(true)}
                            >
                                <Plus className="size-4" />
                                Add subscriber
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
                                    placeholder="Search subscribers..."
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
                                            Email
                                        </th>
                                        <th className="text-muted-foreground hidden px-3 py-2 text-left font-medium sm:table-cell">
                                            Name
                                        </th>
                                        <th className="text-muted-foreground hidden px-3 py-2 text-left font-medium sm:table-cell">
                                            Status
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Subscribed
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-right font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscribers.data.map((subscriber) => (
                                        <tr
                                            key={subscriber.id}
                                            className="border-border border-b last:border-0"
                                        >
                                            <td className="px-3 py-3">
                                                <span className="break-all font-medium">
                                                    {subscriber.email}
                                                </span>
                                                <span className="text-muted-foreground block truncate text-xs sm:hidden">
                                                    {subscriber.name ?? '—'}
                                                </span>
                                            </td>
                                            <td className="text-muted-foreground hidden px-3 py-3 sm:table-cell">
                                                {subscriber.name ?? '—'}
                                            </td>
                                            <td className="hidden px-3 py-3 sm:table-cell">
                                                <Badge
                                                    variant={
                                                        STATUS_VARIANT[subscriber.status] ?? 'secondary'
                                                    }
                                                >
                                                    {STATUS_OPTIONS.find(
                                                        (option) =>
                                                            option.value === subscriber.status,
                                                    )?.label ?? subscriber.status}
                                                </Badge>
                                            </td>
                                            <td className="text-muted-foreground px-3 py-3">
                                                {subscriber.subscribed_at
                                                    ? new Date(
                                                          subscriber.subscribed_at,
                                                      ).toLocaleDateString()
                                                    : '—'}
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            setEditingSubscriber(subscriber)
                                                        }
                                                        aria-label={`Edit ${subscriber.email}`}
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            setDeletingSubscriber(subscriber)
                                                        }
                                                        aria-label={`Delete ${subscriber.email}`}
                                                        className="hover:text-destructive"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {subscribers.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="text-muted-foreground px-3 py-8 text-center"
                                            >
                                                No subscribers found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination paginator={subscribers} />
                    </CardContent>
                </Card>

                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full rounded-xl">
                    <CardHeader>
                        <CardTitle>Newsletter news</CardTitle>
                        <CardDescription>
                            News marked for the newsletter. Published newsletter
                            articles are delivered automatically on publish.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-border border-b">
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Title
                                        </th>
                                        <th className="text-muted-foreground hidden px-3 py-2 text-left font-medium sm:table-cell">
                                            Publish date
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Delivery
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-right font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newsletter_news.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-border border-b last:border-0"
                                        >
                                            <td className="px-3 py-3">
                                                <span className="block max-w-64 truncate font-medium">
                                                    {item.title}
                                                </span>
                                            </td>
                                            <td className="text-muted-foreground hidden px-3 py-3 sm:table-cell">
                                                {formatPublishDate(
                                                    item.publish_at ?? item.newsletter_sent_at,
                                                    Intl.DateTimeFormat().resolvedOptions().timeZone,
                                                )}
                                            </td>
                                            <td className="px-3 py-3">
                                                <Badge
                                                    variant={
                                                        item.newsletter_sent_at
                                                            ? 'secondary'
                                                            : 'outline'
                                                    }
                                                >
                                                    {item.newsletter_sent_at
                                                        ? 'Sent'
                                                        : 'Not sent'}
                                                </Badge>
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <SendNewsletterButton item={item} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {newsletter_news.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="text-muted-foreground px-3 py-8 text-center"
                                            >
                                                No newsletter-marked news yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <CreateSubscriberDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
            />

            <EditSubscriberDialog
                subscriber={editingSubscriber}
                onClose={() => setEditingSubscriber(null)}
            />
            <DeleteSubscriberDialog
                subscriber={deletingSubscriber}
                onClose={() => setDeletingSubscriber(null)}
            />
        </>
    );
}

function SendNewsletterButton({ item }: { item: NewsletterNews }) {
    const [open, setOpen] = useState(false);
    const form = useForm<Record<string, never>>({});

    useEffect(() => {
        if (form.wasSuccessful) {
            form.reset();
            form.clearErrors();
            setOpen(false);
        }
    }, [form.wasSuccessful]);

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
                if (!open) {
                    form.reset();
                    form.clearErrors();
                }
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                    <Send className="size-3.5" />
                    {item.newsletter_sent_at ? 'Resend' : 'Send'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {item.newsletter_sent_at
                            ? 'Resend newsletter'
                            : 'Send newsletter'}
                    </DialogTitle>
                    <DialogDescription>
                        Deliver this article to all subscribed subscribers via email.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.submit(NewsletterSubscriberController.send(item));
                    }}
                >
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
                            Send newsletter
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function CreateSubscriberDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const form = useForm<NewsletterSubscriberFormData>(emptyForm());

    useEffect(() => {
        if (form.wasSuccessful) {
            form.reset();
            form.clearErrors();
            onOpenChange(false);
        }
    }, [form.wasSuccessful]);

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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add subscriber</DialogTitle>
                    <DialogDescription>
                        Add an email to the newsletter subscriber list.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        wireForm(form);
                        form.submit(store());
                    }}
                    className="space-y-4"
                >
                    <SubscriberFormFields form={form} />
                    <StatusSelect form={form} />

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
                            Add subscriber
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditSubscriberDialog({
    subscriber,
    onClose,
}: {
    subscriber: NewsletterSubscriber | null;
    onClose: () => void;
}) {
    const form = useForm<NewsletterSubscriberFormData>(emptyForm());

    useEffect(() => {
        if (subscriber) {
            form.setData(editFormData(subscriber));
            form.clearErrors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subscriber?.id]);

    useEffect(() => {
        if (form.wasSuccessful) {
            form.reset();
            form.clearErrors();
            onClose();
        }
    }, [form.wasSuccessful]);

    return (
        <Dialog
            open={subscriber !== null}
            onOpenChange={(open) => {
                if (!open) {
                    form.reset();
                    form.clearErrors();
                    onClose();
                }
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit subscriber</DialogTitle>
                    <DialogDescription>
                        Update the subscriber information.
                    </DialogDescription>
                </DialogHeader>

                {subscriber && (
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            wireForm(form);
                            form.submit(update(subscriber.id));
                        }}
                        className="space-y-4"
                    >
                        <SubscriberFormFields form={form} />
                        <StatusSelect form={form} />

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

function DeleteSubscriberDialog({
    subscriber,
    onClose,
}: {
    subscriber: NewsletterSubscriber | null;
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

    return (
        <Dialog
            open={subscriber !== null}
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
                    <DialogTitle>Delete subscriber</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this subscriber? This action
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {subscriber && (
                    <>
                        <div className="flex items-center gap-3 rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-200/10 dark:bg-red-700/10 dark:text-red-100">
                            <span className="break-all font-medium">
                                {subscriber.email}
                            </span>
                        </div>

                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                form.submit(destroy(subscriber));
                            }}
                        >
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
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={form.processing}
                                >
                                    Delete subscriber
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

function SubscriberFormFields({
    form,
}: {
    form: ReturnType<typeof useForm<NewsletterSubscriberFormData>>;
}) {
    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                    placeholder="subscriber@example.com"
                    autoComplete="off"
                />
                {form.errors.email && (
                    <p className="text-destructive text-sm">{form.errors.email}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    placeholder="Optional"
                    autoComplete="off"
                />
                {form.errors.name && (
                    <p className="text-destructive text-sm">{form.errors.name}</p>
                )}
            </div>
        </>
    );
}

function StatusSelect({
    form,
}: {
    form: ReturnType<typeof useForm<NewsletterSubscriberFormData>>;
}) {
    return (
        <div className="space-y-2">
            <Label id="status">Status</Label>
            <Select
                value={form.data.status}
                onValueChange={(value) => form.setData('status', value)}
            >
                <SelectTrigger id="status">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {form.errors.status && (
                <p className="text-destructive text-sm">{form.errors.status}</p>
            )}
        </div>
    );
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
                            className={
                                value === option.value ? 'bg-accent' : ''
                            }
                        >
                            {option.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

NewsletterIndex.layout = {
    breadcrumbs: [
        {
            title: 'Newsletter',
            href: index(),
        },
    ],
};