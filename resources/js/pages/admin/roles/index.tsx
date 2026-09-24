import { Head, Link, router, useForm } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import RoleController from '@/actions/App/Http/Controllers/RoleController';
import Pagination, { Paginator } from '@/components/pagination';
import { PermissionPicker, type PermissionOption } from '@/components/permission-picker';
import InputError from '@/components/input-error';
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
import { Label } from '@/components/ui/label';
import { index, show } from '@/routes/management/roles';

type ManagedRole = {
    id: number;
    name: string;
    users_count: number;
    permissions_count: number;
    permission_names: string[];
    created_at: string;
};

export default function RolesIndex({
    roles,
    permissions,
    filters,
}: {
    roles: Paginator<ManagedRole>;
    permissions: PermissionOption[];
    filters: { search: string | null };
}) {
    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [createOpen, setCreateOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<ManagedRole | null>(null);
    const [deletingRole, setDeletingRole] = useState<ManagedRole | null>(null);

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
            <Head title="Roles" />

            <h1 className="sr-only">Roles</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full rounded-xl">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                            <CardTitle>Roles</CardTitle>
                            <CardDescription>
                                Manage roles, user membership and permissions
                            </CardDescription>
                        </div>
                        <Button
                            className="hidden sm:inline-flex"
                            onClick={() => setCreateOpen(true)}
                        >
                            <Plus className="size-4" />
                            Add role
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 sm:hidden">
                            <Button
                                className="w-full"
                                onClick={() => setCreateOpen(true)}
                            >
                                <Plus className="size-4" />
                                Add role
                            </Button>
                        </div>

                        <div className="relative sm:max-w-sm">
                            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input
                                name="search"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Search roles..."
                                className="pl-9"
                                autoComplete="off"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-border border-b">
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Name
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Users
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Permissions
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Created
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-right font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.data.map((role) => (
                                        <RoleRow
                                            key={role.id}
                                            role={role}
                                            onEdit={() => setEditingRole(role)}
                                            onDelete={() =>
                                                setDeletingRole(role)
                                            }
                                        />
                                    ))}
                                    {roles.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="text-muted-foreground px-3 py-8 text-center"
                                            >
                                                No roles found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination paginator={roles} />
                    </CardContent>
                </Card>
            </div>

            <CreateRoleDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                permissions={permissions}
            />

            <EditRoleDialog
                role={editingRole}
                onClose={() => setEditingRole(null)}
                permissions={permissions}
            />

            <DeleteRoleDialog
                role={deletingRole}
                onClose={() => setDeletingRole(null)}
            />
        </>
    );
}

function RoleRow({
    role,
    onEdit,
    onDelete,
}: {
    role: ManagedRole;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const isSuperadmin = role.name === 'superadmin';

    return (
        <tr className="border-border border-b last:border-0">
            <td className="px-3 py-3">
                <div className="flex items-center gap-3">
                    <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full">
                        <ShieldCheck className="text-muted-foreground size-4" />
                    </div>
                    <Link
                        href={show(role.id)}
                        className="font-medium hover:underline"
                    >
                        {role.name}
                    </Link>
                </div>
            </td>
            <td className="px-3 py-3">
                <Badge variant="secondary">{role.users_count}</Badge>
            </td>
            <td className="px-3 py-3">
                <Badge variant="outline">{role.permissions_count}</Badge>
            </td>
            <td className="text-muted-foreground px-3 py-3">
                {new Date(role.created_at).toLocaleDateString()}
            </td>
            <td className="px-3 py-3">
                <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                        <Link
                            href={show(role.id)}
                            aria-label={`View ${role.name}`}
                        >
                            <Eye className="size-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onEdit}
                        disabled={isSuperadmin}
                        aria-label={`Edit ${role.name}`}
                    >
                        <Pencil className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDelete}
                        disabled={isSuperadmin || role.users_count > 0}
                        aria-label={`Delete ${role.name}`}
                        className="hover:text-destructive"
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}

function CreateRoleDialog({
    open,
    onOpenChange,
    permissions,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    permissions: PermissionOption[];
}) {
    const form = useForm<{ name: string; permissions: string[] }>({
        name: '',
        permissions: [],
    });

    useEffect(() => {
        if (form.wasSuccessful) {
            form.reset();
            form.clearErrors();
            onOpenChange(false);
        }
    }, [form.wasSuccessful]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.submit(RoleController.store());
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
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create role</DialogTitle>
                    <DialogDescription>
                        Add a new role to the platform and choose its
                        permissions
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="create-role-name">Role name</Label>
                        <Input
                            id="create-role-name"
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            maxLength={255}
                            placeholder="Role name"
                            autoComplete="off"
                        />
                        <InputError message={form.errors.name} />
                    </div>

                    <div className="space-y-3">
                        <Label>Permissions</Label>
                        <PermissionPicker
                            permissions={permissions}
                            selected={form.data.permissions}
                            onChange={(values) =>
                                form.setData('permissions', values)
                            }
                        />
                        <InputError message={form.errors.permissions} />
                    </div>

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
                        <Button
                            type="submit"
                            disabled={form.processing}
                            data-test="create-role-button"
                        >
                            Create role
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditRoleDialog({
    role,
    onClose,
    permissions,
}: {
    role: ManagedRole | null;
    onClose: () => void;
    permissions: PermissionOption[];
}) {
    const isSuperadmin = role?.name === 'superadmin';
    const form = useForm<{ name: string; permissions: string[] }>({
        name: role?.name ?? '',
        permissions: role?.permission_names ?? [],
    });

    useEffect(() => {
        if (role) {
            form.setData('name', role.name);
            form.setData('permissions', role.permission_names);
            form.clearErrors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role?.id]);

    useEffect(() => {
        if (form.wasSuccessful) {
            form.reset();
            form.clearErrors();
            onClose();
        }
    }, [form.wasSuccessful]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (role && !isSuperadmin) {
            form.submit(RoleController.update(role));
        }
    };

    return (
        <Dialog
            open={role !== null}
            onOpenChange={(open) => {
                if (!open) {
                    form.reset();
                    form.clearErrors();
                    onClose();
                }
            }}
        >
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit role</DialogTitle>
                    <DialogDescription>
                        Update the role information and permissions
                    </DialogDescription>
                </DialogHeader>

                {role && (
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-role-name">Role name</Label>
                            <Input
                                id="edit-role-name"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                maxLength={255}
                                placeholder="Role name"
                                autoComplete="off"
                                disabled={isSuperadmin}
                            />
                            <InputError message={form.errors.name} />
                            {isSuperadmin && (
                                <p className="text-muted-foreground text-sm">
                                    The superadmin role cannot be renamed.
                                </p>
                            )}
                        </div>

                        {!isSuperadmin && (
                            <div className="space-y-3">
                                <Label>Permissions</Label>
                                <PermissionPicker
                                    permissions={permissions}
                                    selected={form.data.permissions}
                                    onChange={(values) =>
                                        form.setData('permissions', values)
                                    }
                                />
                                <InputError
                                    message={form.errors.permissions}
                                />
                            </div>
                        )}

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
                            <Button
                                type="submit"
                                disabled={form.processing || isSuperadmin}
                                data-test="update-role-button"
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}

function DeleteRoleDialog({
    role,
    onClose,
}: {
    role: ManagedRole | null;
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

        if (role) {
            form.submit(RoleController.destroy(role));
        }
    };

    return (
        <Dialog
            open={role !== null}
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
                    <DialogTitle>Delete role</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this role? This action
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {role && (
                    <>
                        <div className="rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-200/10 dark:bg-red-700/10 dark:text-red-100">
                            {role.name}
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
                                    Delete role
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

RolesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Roles',
            href: index(),
        },
    ],
};