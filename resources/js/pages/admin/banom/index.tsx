import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ImageIcon,
    Pencil,
    Plus,
    Search,
    Trash2,
    Users,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import BanomController from '@/actions/App/Http/Controllers/BanomController';
import { BanomFormFields } from '@/components/banom-form';
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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { index } from '@/routes/management/banom';
import { index as officersIndex } from '@/routes/management/banom/officers';
import { storageUrl } from '@/lib/upload-banom-image';
import {
    editBanomFormData,
    emptyBanomForm,
    wireBanomForm,
} from '@/lib/banom';
import type { BanomFormData, BanomItem } from '@/lib/banom';

export default function BanomIndex({
    banoms,
    filters,
}: {
    banoms: Paginator<BanomItem>;
    filters: { search: string | null };
}) {
    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [createOpen, setCreateOpen] = useState(false);
    const [editingBanom, setEditingBanom] = useState<BanomItem | null>(null);
    const [deletingBanom, setDeletingBanom] = useState<BanomItem | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== (filters.search ?? '')) {
                router.get(index(), { search: searchValue || undefined }, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                });
            }
        }, 400);

        return () => clearTimeout(timer);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue]);

    return (
        <>
            <Head title="Banom" />

            <h1 className="sr-only">Banom</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full rounded-xl">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                            <CardTitle>Banom</CardTitle>
                            <CardDescription>
                                Manage banom organizations and their officers
                            </CardDescription>
                        </div>
                        <Button
                            className="hidden sm:inline-flex"
                            onClick={() => setCreateOpen(true)}
                        >
                            <Plus className="size-4" />
                            Add banom
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 sm:hidden">
                            <Button
                                className="w-full"
                                onClick={() => setCreateOpen(true)}
                            >
                                <Plus className="size-4" />
                                Add banom
                            </Button>
                        </div>

                        <div className="relative flex-1 sm:max-w-sm">
                            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input
                                name="search"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Search banom..."
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
                                            Banom
                                        </th>
                                        <th className="text-muted-foreground hidden px-3 py-2 text-left font-medium sm:table-cell">
                                            Tagline
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-right font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {banoms.data.map((banom) => (
                                        <BanomRow
                                            key={banom.id}
                                            banom={banom}
                                            onEdit={() =>
                                                setEditingBanom(banom)
                                            }
                                            onDelete={() =>
                                                setDeletingBanom(banom)
                                            }
                                        />
                                    ))}
                                    {banoms.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="text-muted-foreground px-3 py-8 text-center"
                                            >
                                                No banom found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination paginator={banoms} />
                    </CardContent>
                </Card>
            </div>

            <CreateBanomDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
            />

            <EditBanomDialog
                banom={editingBanom}
                onClose={() => setEditingBanom(null)}
            />

            <DeleteBanomDialog
                banom={deletingBanom}
                onClose={() => setDeletingBanom(null)}
            />
        </>
    );
}

function BanomRow({
    banom,
    onEdit,
    onDelete,
}: {
    banom: BanomItem;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <tr className="border-border border-b last:border-0">
            <td className="text-muted-foreground px-3 py-3">
                {banom.sort_order}
            </td>
            <td className="px-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                    {banom.logo_url ? (
                        <img
                            src={banom.logo_url}
                            alt=""
                            className="bg-muted size-10 shrink-0 rounded-full object-cover"
                        />
                    ) : (
                        <span className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
                            <Users className="text-muted-foreground size-4" />
                        </span>
                    )}
                    <div className="min-w-0">
                        <span className="block truncate font-medium">
                            {banom.name}
                        </span>
                        <span className="text-muted-foreground block truncate text-xs sm:hidden">
                            {banom.tagline || '-'}
                        </span>
                    </div>
                </div>
            </td>
            <td className="text-muted-foreground hidden max-w-64 truncate px-3 py-3 sm:table-cell">
                {banom.tagline || '-'}
            </td>
            <td className="px-3 py-3">
                <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                        <Link
                            href={officersIndex(banom)}
                            aria-label={`Manage officers of ${banom.name}`}
                        >
                            <Users className="size-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onEdit}
                        aria-label={`Edit ${banom.name}`}
                    >
                        <Pencil className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDelete}
                        aria-label={`Delete ${banom.name}`}
                        className="hover:text-destructive"
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}

function CreateBanomDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const form = useForm<BanomFormData>(emptyBanomForm());

    useEffect(() => {
        if (form.wasSuccessful) {
            form.reset();
            form.clearErrors();
            onOpenChange(false);
        }
    }, [form.wasSuccessful]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        wireBanomForm(form);
        form.submit(BanomController.store());
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
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create banom</DialogTitle>
                    <DialogDescription>
                        Add a new banom to the platform
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <BanomFormFields form={form} titlePrefix="create" />

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
                            Create banom
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditBanomDialog({
    banom,
    onClose,
}: {
    banom: BanomItem | null;
    onClose: () => void;
}) {
    const form = useForm<BanomFormData>(emptyBanomForm());

    useEffect(() => {
        if (banom) {
            form.setData(editBanomFormData(banom));
            form.clearErrors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [banom?.id]);

    useEffect(() => {
        if (form.wasSuccessful) {
            form.reset();
            form.clearErrors();
            onClose();
        }
    }, [form.wasSuccessful]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (banom) {
            wireBanomForm(form);
            form.submit(BanomController.update(banom));
        }
    };

    return (
        <Dialog
            open={banom !== null}
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
                    <DialogTitle>Edit banom</DialogTitle>
                    <DialogDescription>
                        Update the banom information
                    </DialogDescription>
                </DialogHeader>

                {banom && (
                    <form onSubmit={onSubmit} className="space-y-4">
                        <BanomFormFields form={form} titlePrefix="edit" />

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

function DeleteBanomDialog({
    banom,
    onClose,
}: {
    banom: BanomItem | null;
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

        if (banom) {
            form.submit(BanomController.destroy(banom));
        }
    };

    return (
        <Dialog
            open={banom !== null}
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
                    <DialogTitle>Delete banom</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this banom? This
                        action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {banom && (
                    <>
                        <div className="flex items-center gap-3 rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-200/10 dark:bg-red-700/10 dark:text-red-100">
                            {banom.logo_url ? (
                                <img
                                    src={banom.logo_url}
                                    alt=""
                                    className="bg-muted size-10 shrink-0 rounded-full object-cover"
                                />
                            ) : (
                                <span className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
                                    <ImageIcon className="text-muted-foreground size-4" />
                                </span>
                            )}
                            <span className="font-medium">{banom.name}</span>
                            {banom.tagline && (
                                <span className="text-muted-foreground">
                                    {banom.tagline}
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
                                    Delete banom
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

BanomIndex.layout = {
    breadcrumbs: [
        {
            title: 'Banom',
            href: index(),
        },
    ],
};