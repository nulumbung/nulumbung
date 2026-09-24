import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Eye,
    ImageIcon,
    MoreVertical,
    Pencil,
    Plus,
    Search,
    Trash2,
    Video,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import MediaController from '@/actions/App/Http/Controllers/MediaController';
import { MediaFormFields } from '@/components/media-form';
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
import {
    STATUS_OPTIONS,
    STATUS_VARIANT,
    TYPE_OPTIONS,
    editFormData,
    emptyForm,
    wireForm,
} from '@/lib/media';
import type { MediaFormData, MediaItem } from '@/lib/media';
import { index, show } from '@/routes/management/media';

export default function MediaIndex({
    media,
    filters,
}: {
    media: Paginator<MediaItem>;
    filters: {
        search: string | null;
        type: string | null;
        status: string | null;
    };
}) {
    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [typeValue, setTypeValue] = useState(filters.type ?? '');
    const [statusValue, setStatusValue] = useState(filters.status ?? '');
    const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
    const [deletingMedia, setDeletingMedia] = useState<MediaItem | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = {
                search: searchValue || undefined,
                type: typeValue || undefined,
                status: statusValue || undefined,
            };

            if (
                searchValue !== (filters.search ?? '') ||
                typeValue !== (filters.type ?? '') ||
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
    }, [searchValue, typeValue, statusValue]);

    return (
        <>
            <Head title="Media" />

            <h1 className="sr-only">Media</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full rounded-xl">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                            <CardTitle>Media</CardTitle>
                            <CardDescription>
                                Manage photos and videos for the platform
                            </CardDescription>
                        </div>
                        <CreateMediaDialog className="hidden sm:inline-flex" />
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="flex sm:hidden">
                            <CreateMediaDialog className="w-full" />
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative flex-1 sm:max-w-sm">
                                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                                <Input
                                    name="search"
                                    value={searchValue}
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
                                    placeholder="Search media..."
                                    className="pl-9"
                                    autoComplete="off"
                                />
                            </div>

                            <Select
                                value={typeValue || 'all'}
                                onValueChange={(value) =>
                                    setTypeValue(value === 'all' ? '' : value)
                                }
                            >
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All types
                                    </SelectItem>
                                    {TYPE_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={statusValue || 'all'}
                                onValueChange={(value) =>
                                    setStatusValue(value === 'all' ? '' : value)
                                }
                            >
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All statuses
                                    </SelectItem>
                                    {STATUS_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-border border-b">
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Preview
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Title
                                        </th>
                                        <th className="text-muted-foreground hidden px-3 py-2 text-left font-medium sm:table-cell">
                                            Type
                                        </th>
                                        <th className="text-muted-foreground hidden px-3 py-2 text-left font-medium sm:table-cell">
                                            Status
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Order
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-right font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {media.data.map((item) => (
                                        <MediaRow
                                            key={item.id}
                                            item={item}
                                            onEdit={() =>
                                                setEditingMedia(item)
                                            }
                                            onDelete={() =>
                                                setDeletingMedia(item)
                                            }
                                        />
                                    ))}
                                    {media.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="text-muted-foreground px-3 py-8 text-center"
                                            >
                                                No media found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination paginator={media} />
                    </CardContent>
                </Card>
            </div>

            <EditMediaDialog
                item={editingMedia}
                onClose={() => setEditingMedia(null)}
            />
            <DeleteMediaDialog
                item={deletingMedia}
                onClose={() => setDeletingMedia(null)}
            />
        </>
    );
}

function MediaRow({
    item,
    onEdit,
    onDelete,
}: {
    item: MediaItem;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const preview =
        item.type === 'photo' ? item.preview_url : item.thumbnail_url;

    return (
        <tr className="border-border border-b last:border-0">
            <td className="px-3 py-3">
                <Link href={show(item.id)} className="block" aria-label={`View ${item.title}`}>
                    <span className="bg-muted flex size-14 items-center justify-center overflow-hidden rounded-md">
                        {preview ? (
                            <img
                                src={preview}
                                alt=""
                                className="size-full object-cover"
                            />
                        ) : item.type === 'video' ? (
                            <Video className="text-muted-foreground size-5" />
                        ) : (
                            <ImageIcon className="text-muted-foreground size-5" />
                        )}
                    </span>
                </Link>
            </td>
            <td className="px-3 py-3">
                <div className="min-w-0">
                    <Link
                        href={show(item.id)}
                        className="hover:text-foreground block max-w-64 truncate font-medium"
                    >
                        {item.title}
                    </Link>
                    <span className="text-muted-foreground mt-1 flex gap-2 text-xs sm:hidden">
                        <Badge
                            variant={STATUS_VARIANT[item.status] ?? 'outline'}
                        >
                            {STATUS_OPTIONS.find(
                                (option) => option.value === item.status,
                            )?.label ?? item.status}
                        </Badge>
                        <Badge variant="secondary">
                            {item.type === 'video' ? 'Video' : 'Photo'}
                        </Badge>
                    </span>
                </div>
            </td>
            <td className="hidden px-3 py-3 sm:table-cell">
                <Badge variant="secondary">
                    {item.type === 'video' ? 'Video' : 'Photo'}
                </Badge>
            </td>
            <td className="hidden px-3 py-3 sm:table-cell">
                <Badge variant={STATUS_VARIANT[item.status] ?? 'outline'}>
                    {STATUS_OPTIONS.find(
                        (option) => option.value === item.status,
                    )?.label ?? item.status}
                </Badge>
            </td>
            <td className="text-muted-foreground px-3 py-3">
                {item.sort_order}
            </td>
            <td className="px-3 py-3">
                <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                        <Link
                            href={show(item.id)}
                            aria-label={`View ${item.title}`}
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

function CreateMediaDialog({ className }: { className?: string }) {
    const [open, setOpen] = useState(false);
    const form = useForm<MediaFormData>(emptyForm());

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
        form.submit(MediaController.store());
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
                    Create media
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create media</DialogTitle>
                    <DialogDescription>
                        Add a new photo or video to the platform
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <MediaFormFields form={form} titlePrefix="create" />

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
                            Create media
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditMediaDialog({
    item,
    onClose,
}: {
    item: MediaItem | null;
    onClose: () => void;
}) {
    const form = useForm<MediaFormData>(emptyForm());

    useEffect(() => {
        if (item) {
            form.setData(editFormData(item));
            form.clearErrors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item?.id]);

    useEffect(() => {
        if (form.wasSuccessful) {
            form.reset();
            form.clearErrors();
            onClose();
        }
    }, [form.wasSuccessful]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (item) {
            wireForm(form);
            form.submit(MediaController.update(item));
        }
    };

    return (
        <Dialog
            open={item !== null}
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
                    <DialogTitle>Edit media</DialogTitle>
                    <DialogDescription>
                        Update the media information
                    </DialogDescription>
                </DialogHeader>

                {item && (
                    <form onSubmit={onSubmit} className="space-y-4">
                        <MediaFormFields form={form} titlePrefix="edit" />

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

function DeleteMediaDialog({
    item,
    onClose,
}: {
    item: MediaItem | null;
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

        if (item) {
            form.submit(MediaController.destroy(item));
        }
    };

    return (
        <Dialog
            open={item !== null}
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
                    <DialogTitle>Delete media</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this media? This action
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {item && (
                    <>
                        <div className="flex items-center gap-3 rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-200/10 dark:bg-red-700/10 dark:text-red-100">
                            <span className="font-medium">{item.title}</span>
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
                                    Delete media
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

MediaIndex.layout = {
    breadcrumbs: [
        {
            title: 'Media',
            href: index(),
        },
    ],
};