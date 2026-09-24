import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ImageIcon,
    Pencil,
    Plus,
    Search,
    Trash2,
    UserRound,
} from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import BanomOfficerController from '@/actions/App/Http/Controllers/BanomOfficerController';
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
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { index as banomsIndex } from '@/routes/management/banom';
import { index as officersIndex } from '@/routes/management/banom/officers';
import { storageUrl, uploadBanomImage } from '@/lib/upload-banom-image';
import {
    OFFICER_STATUS_OPTIONS,
    POSITION_OPTIONS,
} from '@/lib/banom';
import type {
    BanomItem,
    BanomOfficerFormData,
    BanomOfficerItem,
    OfficerPosition,
    OfficerStatus,
} from '@/lib/banom';
import { toast } from 'sonner';

export default function BanomOfficers({
    banom,
    officers,
    filters,
}: {
    banom: Pick<BanomItem, 'id' | 'name' | 'tagline' | 'logo' | 'logo_url'>;
    officers: Paginator<BanomOfficerItem>;
    filters: { status: string; search: string | null };
}) {
    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [editingOfficer, setEditingOfficer] =
        useState<BanomOfficerItem | null>(null);
    const [deletingOfficer, setDeletingOfficer] =
        useState<BanomOfficerItem | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== (filters.search ?? '')) {
                router.get(
                    officersIndex(banom),
                    {
                        search: searchValue || undefined,
                        status: filters.status,
                    },
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

    const goToStatus = (status: string) => {
        if (status === filters.status) {
            return;
        }

        router.get(
            officersIndex(banom),
            {
                status,
                search: searchValue || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <>
            <Head title="Manage officers" />

            <h1 className="sr-only">Manage officers</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full rounded-xl">
                    <CardHeader className="space-y-4">
                        <div className="flex items-center justify-between sm:hidden">
                            <Link href={banomsIndex()}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Back"
                                >
                                    <ArrowLeft className="size-4" />
                                </Button>
                            </Link>
                            <CreateOfficerDialog banom={banom} />
                        </div>

                        <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                                {banom.logo_url && (
                                    <img
                                        src={banom.logo_url}
                                        alt=""
                                        className="bg-muted size-10 shrink-0 rounded-full object-cover"
                                    />
                                )}
                                <div className="min-w-0 space-y-0.5">
                                    <CardTitle className="truncate leading-tight">
                                        {banom.name}
                                    </CardTitle>
                                    <CardDescription className="truncate">
                                        {banom.tagline || 'Manage officers'}
                                    </CardDescription>
                                </div>
                            </div>

                            <div className="hidden shrink-0 items-center gap-2 sm:flex">
                                <Link href={banomsIndex()}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Back"
                                    >
                                        <ArrowLeft className="size-4" />
                                    </Button>
                                </Link>
                                <CreateOfficerDialog banom={banom} />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="relative flex-1 sm:max-w-sm">
                            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input
                                name="search"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Search officers..."
                                className="pl-9"
                                autoComplete="off"
                            />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1 rounded-md border p-1">
                                {OFFICER_STATUS_OPTIONS.map((option) => (
                                    <Button
                                        key={option.value}
                                        type="button"
                                        variant={
                                            filters.status === option.value
                                                ? 'default'
                                                : 'ghost'
                                        }
                                        size="sm"
                                        onClick={() =>
                                            goToStatus(option.value)
                                        }
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-border border-b">
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Photo
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Full name
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Position
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Period
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Status
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-right font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {officers.data.map((officer) => (
                                        <OfficerRow
                                            key={officer.id}
                                            officer={officer}
                                            onEdit={() =>
                                                setEditingOfficer(officer)
                                            }
                                            onDelete={() =>
                                                setDeletingOfficer(officer)
                                            }
                                        />
                                    ))}
                                    {officers.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="text-muted-foreground px-3 py-8 text-center"
                                            >
                                                No officers found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination paginator={officers} />
                    </CardContent>
                </Card>
            </div>

            <EditOfficerDialog
                banom={banom}
                officer={editingOfficer}
                onClose={() => setEditingOfficer(null)}
            />
            <DeleteOfficerDialog
                banom={banom}
                officer={deletingOfficer}
                onClose={() => setDeletingOfficer(null)}
            />
        </>
    );
}

function PositionBadge({ position }: { position: OfficerPosition }) {
    const label = POSITION_OPTIONS.find(
        (option) => option.value === position,
    )?.label;

    return <Badge variant="secondary">{label ?? position}</Badge>;
}

function StatusBadge({ status }: { status: OfficerStatus }) {
    if (status === 'demisioner') {
        return <Badge variant="outline">Demisioner</Badge>;
    }

    return <Badge>Active</Badge>;
}

function OfficerRow({
    officer,
    onEdit,
    onDelete,
}: {
    officer: BanomOfficerItem;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <tr className="border-border border-b last:border-0">
            <td className="px-3 py-3">
                {officer.photo_url ? (
                    <img
                        src={officer.photo_url}
                        alt=""
                        className="bg-muted size-10 rounded-full object-cover"
                    />
                ) : (
                    <span className="bg-muted flex size-10 items-center justify-center rounded-full">
                        <UserRound className="text-muted-foreground size-4" />
                    </span>
                )}
            </td>
            <td className="px-3 py-3 font-medium">{officer.name}</td>
            <td className="px-3 py-3">
                <PositionBadge position={officer.position} />
            </td>
            <td className="text-muted-foreground px-3 py-3">
                {officer.period || '-'}
            </td>
            <td className="px-3 py-3">
                <StatusBadge status={officer.status} />
            </td>
            <td className="px-3 py-3">
                <div className="flex items-center justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onEdit}
                        aria-label={`Edit ${officer.name}`}
                    >
                        <Pencil className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDelete}
                        aria-label={`Delete ${officer.name}`}
                        className="hover:text-destructive"
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}

function OfficerFormFields({
    form,
    titlePrefix,
}: {
    form: ReturnType<typeof useForm<BanomOfficerFormData>>;
    titlePrefix: 'create' | 'edit';
}) {
    const [uploading, setUploading] = useState(false);

    const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) {
            return;
        }

        setUploading(true);

        try {
            const path = await uploadBanomImage(file);
            form.setData('photo', path);
        } catch {
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label>Profile photo</Label>
                {form.data.photo ? (
                    <div className="flex items-center gap-3">
                        <img
                            src={storageUrl(form.data.photo)}
                            alt=""
                            className="bg-muted size-20 rounded-full object-cover"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => form.setData('photo', '')}
                        >
                            Remove image
                        </Button>
                    </div>
                ) : (
                    <Label
                        htmlFor={`${titlePrefix}-photo`}
                        className="border-muted text-muted-foreground hover:bg-muted/50 flex h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed"
                    >
                        <ImageIcon className="size-6" />
                        <span className="text-sm">
                            {uploading
                                ? 'Uploading...'
                                : 'Click to upload the profile photo'}
                        </span>
                    </Label>
                )}
                <input
                    id={`${titlePrefix}-photo`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                />
                <InputError message={form.errors.photo} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={`${titlePrefix}-name`}>Full name</Label>
                <Input
                    id={`${titlePrefix}-name`}
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    autoComplete="off"
                />
                <InputError message={form.errors.name} />
            </div>

            <div className="grid gap-2">
                <Label>Position</Label>
                <Select
                    value={form.data.position}
                    onValueChange={(value) => form.setData('position', value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {POSITION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={form.errors.position} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={`${titlePrefix}-period`}>Period</Label>
                <Input
                    id={`${titlePrefix}-period`}
                    value={form.data.period}
                    onChange={(e) => form.setData('period', e.target.value)}
                    placeholder="e.g. 2024-2026"
                    autoComplete="off"
                />
                <InputError message={form.errors.period} />
            </div>

            <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                    value={form.data.status}
                    onValueChange={(value) => form.setData('status', value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {OFFICER_STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={form.errors.status} />
            </div>
        </div>
    );
}

function emptyOfficerForm() {
    return {
        photo: '',
        name: '',
        position: 'ketua',
        period: '',
        status: 'aktif',
    };
}

function CreateOfficerDialog({
    banom,
    className,
}: {
    banom: Pick<BanomItem, 'id' | 'name' | 'tagline' | 'logo' | 'logo_url'>;
    className?: string;
}) {
    const [open, setOpen] = useState(false);
    const form = useForm<BanomOfficerFormData>(emptyOfficerForm());

    useEffect(() => {
        if (form.wasSuccessful) {
            form.reset();
            form.clearErrors();
            setOpen(false);
        }
    }, [form.wasSuccessful]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.submit(BanomOfficerController.store({ banom }));
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
            <Button
                className={className}
                onClick={() => setOpen(true)}
                type="button"
            >
                <Plus className="size-4" />
                Add officer
            </Button>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Add officer</DialogTitle>
                    <DialogDescription>
                        Add a new officer to this banom
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <OfficerFormFields form={form} titlePrefix="create" />

                    <DialogFooter className="flex-row justify-end gap-2 [&>button]:flex-1 sm:[&>button]:flex-none">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    form.reset();
                                    form.clearErrors();
                                    setOpen(false);
                                }}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={form.processing}>
                            Add officer
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditOfficerDialog({
    banom,
    officer,
    onClose,
}: {
    banom: Pick<BanomItem, 'id' | 'name' | 'tagline' | 'logo' | 'logo_url'>;
    officer: BanomOfficerItem | null;
    onClose: () => void;
}) {
    const form = useForm<BanomOfficerFormData>(emptyOfficerForm());

    useEffect(() => {
        if (officer) {
            form.setData({
                photo: officer.photo ?? '',
                name: officer.name,
                position: officer.position,
                period: officer.period ?? '',
                status: officer.status,
            });
            form.clearErrors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [officer?.id]);

    useEffect(() => {
        if (form.wasSuccessful) {
            form.reset();
            form.clearErrors();
            onClose();
        }
    }, [form.wasSuccessful]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (officer) {
            form.submit(BanomOfficerController.update({ banom, officer }));
        }
    };

    return (
        <Dialog
            open={officer !== null}
            onOpenChange={(open) => {
                if (!open) {
                    form.reset();
                    form.clearErrors();
                    onClose();
                }
            }}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Edit officer</DialogTitle>
                    <DialogDescription>
                        Update the officer information
                    </DialogDescription>
                </DialogHeader>

                {officer && (
                    <form onSubmit={onSubmit} className="space-y-4">
                        <OfficerFormFields form={form} titlePrefix="edit" />

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

function DeleteOfficerDialog({
    banom,
    officer,
    onClose,
}: {
    banom: Pick<BanomItem, 'id' | 'name' | 'tagline' | 'logo' | 'logo_url'>;
    officer: BanomOfficerItem | null;
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

        if (officer) {
            form.submit(BanomOfficerController.destroy({ banom, officer }));
        }
    };

    return (
        <Dialog
            open={officer !== null}
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
                    <DialogTitle>Delete officer</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this officer? This
                        action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {officer && (
                    <>
                        <div className="flex items-center gap-3 rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-200/10 dark:bg-red-700/10 dark:text-red-100">
                            <span className="font-medium">{officer.name}</span>
                            {officer.period && (
                                <span className="text-muted-foreground">
                                    {officer.period}
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
                                    Delete officer
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

BanomOfficers.layout = ({
    banom,
}: {
    banom: Pick<BanomItem, 'id' | 'name' | 'tagline' | 'logo' | 'logo_url'>;
}) => ({
    breadcrumbs: [
        {
            title: 'Banom',
            href: banomsIndex(),
        },
        {
            title: banom.name,
            href: officersIndex(banom),
        },
    ],
});