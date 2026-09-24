import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Eye,
    ImageIcon,
    MoreVertical,
    Pencil,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import HistoryController from '@/actions/App/Http/Controllers/HistoryController';
import { HistoryFormFields } from '@/components/history-form';
import Pagination, { Paginator } from '@/components/pagination';
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
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { editFormData, emptyForm, wireForm } from '@/lib/history';
import type { HistoryFormData, HistoryItem } from '@/lib/history';
import { index, show } from '@/routes/management/history';

export default function HistoryIndex({
    histories,
    filters,
}: {
    histories: Paginator<HistoryItem>;
    filters: { search: string | null };
}) {
    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [editingHistory, setEditingHistory] = useState<HistoryItem | null>(
        null,
    );
    const [deletingHistory, setDeletingHistory] = useState<HistoryItem | null>(
        null,
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== (filters.search ?? '')) {
                router.get(
                    index(),
                    { search: searchValue || undefined },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                    },
                );
            }
        }, 400);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue]);

    return (
        <>
            <Head title="History" />

            <h1 className="sr-only">History</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full rounded-xl">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                            <CardTitle>History</CardTitle>
                            <CardDescription>
                                Manage the history entries of the platform
                            </CardDescription>
                        </div>
                        <CreateHistoryDialog className="hidden sm:inline-flex" />
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="flex sm:hidden">
                            <CreateHistoryDialog className="w-full" />
                        </div>

                        <div className="relative flex-1 sm:max-w-sm">
                            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input
                                name="search"
                                value={searchValue}
                                onChange={(e) =>
                                    setSearchValue(e.target.value)
                                }
                                placeholder="Search history..."
                                className="pl-9"
                                autoComplete="off"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-border border-b">
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Order
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            History title
                                        </th>
                                        <th className="text-muted-foreground hidden px-3 py-2 text-left font-medium sm:table-cell">
                                            Year
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-right font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {histories.data.map((history) => (
                                        <HistoryRow
                                            key={history.id}
                                            history={history}
                                            onEdit={() =>
                                                setEditingHistory(history)
                                            }
                                            onDelete={() =>
                                                setDeletingHistory(history)
                                            }
                                        />
                                    ))}
                                    {histories.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="text-muted-foreground px-3 py-8 text-center"
                                            >
                                                No history found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination paginator={histories} />
                    </CardContent>
                </Card>
            </div>

            <EditHistoryDialog
                history={editingHistory}
                onClose={() => setEditingHistory(null)}
            />
            <DeleteHistoryDialog
                history={deletingHistory}
                onClose={() => setDeletingHistory(null)}
            />
        </>
    );
}

function HistoryRow({
    history,
    onEdit,
    onDelete,
}: {
    history: HistoryItem;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <tr className="border-border border-b last:border-0">
            <td className="text-muted-foreground px-3 py-3">
                {history.sort_order}
            </td>
            <td className="px-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                    <Link
                        href={show(history.id)}
                        aria-label={`View ${history.title}`}
                    >
                        {history.image_url ? (
                            <img
                                src={history.image_url}
                                alt=""
                                className="bg-muted h-12 w-16 shrink-0 rounded-md object-cover"
                            />
                        ) : (
                            <span className="bg-muted flex h-12 w-16 shrink-0 items-center justify-center rounded-md">
                                <ImageIcon className="text-muted-foreground size-4" />
                            </span>
                        )}
                    </Link>
                    <div className="min-w-0">
                        <Link
                            href={show(history.id)}
                            className="hover:text-foreground block truncate font-medium"
                        >
                            {history.title}
                        </Link>
                        <span className="text-muted-foreground block truncate text-xs sm:hidden">
                            {history.year || '-'}
                        </span>
                    </div>
                </div>
            </td>
            <td className="text-muted-foreground hidden px-3 py-3 sm:table-cell">
                {history.year || '-'}
            </td>
            <td className="px-3 py-3">
                <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                        <Link
                            href={show(history.id)}
                            aria-label={`View ${history.title}`}
                        >
                            <Eye className="size-4" />
                        </Link>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Actions">
                                <MoreVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={onEdit} className="gap-2">
                                <Pencil className="size-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={onDelete}
                                className="focus:text-destructive gap-2"
                            >
                                <Trash2 className="size-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </td>
        </tr>
    );
}

function CreateHistoryDialog({ className }: { className?: string }) {
    const [open, setOpen] = useState(false);
    const form = useForm<HistoryFormData>(emptyForm());

    useEffect(() => {
        if (form.wasSuccessful) {
            form.reset();
            form.clearErrors();
            setOpen(false);
        }
    }, [form.wasSuccessful]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        wireForm(form);
        form.submit(HistoryController.store());
    };

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
                <Button className={className}>
                    <Plus className="size-4" />
                    Create history
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create history</DialogTitle>
                    <DialogDescription>
                        Add a new history entry to the platform
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <HistoryFormFields form={form} titlePrefix="create" />

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
                            Create history
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditHistoryDialog({
    history,
    onClose,
}: {
    history: HistoryItem | null;
    onClose: () => void;
}) {
    const form = useForm<HistoryFormData>(emptyForm());

    useEffect(() => {
        if (history) {
            form.setData(editFormData(history));
            form.clearErrors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history?.id]);

    useEffect(() => {
        if (form.wasSuccessful) {
            form.reset();
            form.clearErrors();
            onClose();
        }
    }, [form.wasSuccessful]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (history) {
            wireForm(form);
            form.submit(HistoryController.update(history));
        }
    };

    return (
        <Dialog
            open={history !== null}
            onOpenChange={(open) => {
                if (!open) {
                    form.reset();
                    form.clearErrors();
                    onClose();
                }
            }}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit history</DialogTitle>
                    <DialogDescription>
                        Update the history information
                    </DialogDescription>
                </DialogHeader>

                {history && (
                    <form onSubmit={onSubmit} className="space-y-4">
                        <HistoryFormFields form={form} titlePrefix="edit" />

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

function DeleteHistoryDialog({
    history,
    onClose,
}: {
    history: HistoryItem | null;
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

        if (history) {
            form.submit(HistoryController.destroy(history));
        }
    };

    return (
        <Dialog
            open={history !== null}
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
                    <DialogTitle>Delete history</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this history? This
                        action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {history && (
                    <>
                        <div className="flex items-center gap-3 rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-200/10 dark:bg-red-700/10 dark:text-red-100">
                            <span className="font-medium">{history.title}</span>
                            {history.year && (
                                <span className="text-muted-foreground">
                                    {history.year}
                                </span>
                            )}
                        </div>

                        <form onSubmit={onSubmit}>
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
                                    Delete history
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

HistoryIndex.layout = {
    breadcrumbs: [
        {
            title: 'History',
            href: index(),
        },
    ],
};