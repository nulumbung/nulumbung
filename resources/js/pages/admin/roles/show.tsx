import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, Pencil, ShieldCheck, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import RoleController from '@/actions/App/Http/Controllers/RoleController';
import { PermissionPicker, type PermissionOption } from '@/components/permission-picker';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { useInitials } from '@/hooks/use-initials';
import { index, show } from '@/routes/management/roles';

type ManagedRole = {
    id: number;
    name: string;
    users_count: number;
    permissions_count: number;
    permission_names: string[];
    created_at: string;
};

type AssignedUser = {
    id: number;
    name: string;
    email: string;
};

export default function RolesShow({
    role,
    permissions,
    users,
}: {
    role: ManagedRole;
    permissions: PermissionOption[];
    users: AssignedUser[];
}) {
    const getInitials = useInitials();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const isSuperadmin = role.name === 'superadmin';

    const permissionLabels = role.permission_names.map(
        (value) =>
            permissions.find((permission) => permission.value === value)
                ?.label ?? value,
    );

    const form = useForm<Record<string, never>>({});

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.submit(RoleController.destroy(role));
    };

    return (
        <>
            <Head title={role.name} />

            <h1 className="sr-only">{role.name}</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-2xl self-center rounded-xl">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-muted flex size-14 shrink-0 items-center justify-center rounded-full">
                                <ShieldCheck className="text-muted-foreground size-6" />
                            </div>
                            <div className="space-y-1">
                                <CardTitle>{role.name}</CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <Badge variant="secondary">
                                        {role.users_count}
                                    </Badge>
                                    {role.users_count === 1 ? 'user' : 'users'}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" asChild>
                                <Link href={index()}>Back</Link>
                            </Button>
                            {isSuperadmin ? (
                                <Button
                                    variant="secondary"
                                    disabled
                                    className="gap-2"
                                >
                                    <Pencil className="size-4" />
                                    Edit
                                </Button>
                            ) : (
                                <Button
                                    variant="secondary"
                                    onClick={() => setEditOpen(true)}
                                    className="gap-2"
                                >
                                    <Pencil className="size-4" />
                                    Edit
                                </Button>
                            )}
                            <Button
                                variant="destructive"
                                onClick={() => setDeleteOpen(true)}
                                disabled={isSuperadmin || role.users_count > 0}
                                data-test="delete-role-button"
                            >
                                <Trash2 className="size-4" />
                                Delete
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 rounded-lg border p-4">
                            <Calendar className="text-muted-foreground size-4 shrink-0" />
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Created
                                </p>
                                <p className="text-sm font-medium">
                                    {new Date(
                                        role.created_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-medium">
                                Permissions ({role.permissions_count})
                            </p>
                            {permissionLabels.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {permissionLabels.map((label) => (
                                        <Badge
                                            key={label}
                                            variant="secondary"
                                            className="gap-1.5"
                                        >
                                            <ShieldCheck className="size-3" />
                                            {label}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">
                                    No permissions assigned
                                </p>
                            )}
                        </div>

                        {users.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    Assigned users
                                </p>
                                <ul className="divide-border divide-y rounded-lg border">
                                    {users.map((user) => (
                                        <li
                                            key={user.id}
                                            className="flex items-center justify-between gap-3 px-4 py-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar className="bg-muted size-8 rounded-full">
                                                    <AvatarFallback className="rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium">
                                                    {user.name}
                                                </span>
                                            </div>
                                            <span className="text-muted-foreground text-sm">
                                                {user.email}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete role</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this role? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-200/10 dark:bg-red-700/10 dark:text-red-100">
                        {role.name}
                    </div>

                    <form onSubmit={onSubmit}>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setDeleteOpen(false)}
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
                </DialogContent>
            </Dialog>

            <EditRoleDialog
                role={role}
                permissions={permissions}
                open={editOpen}
                onOpenChange={setEditOpen}
            />
        </>
    );
}

function EditRoleDialog({
    role,
    permissions,
    open,
    onOpenChange,
}: {
    role: ManagedRole;
    permissions: PermissionOption[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const isSuperadmin = role.name === 'superadmin';
    const form = useForm<{ name: string; permissions: string[] }>({
        name: role.name,
        permissions: role.permission_names,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isSuperadmin) {
            form.submit(RoleController.update(role));
        }
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
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit role</DialogTitle>
                    <DialogDescription>
                        Update the role information and permissions
                    </DialogDescription>
                </DialogHeader>

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
                            <InputError message={form.errors.permissions} />
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
            </DialogContent>
        </Dialog>
    );
}

RolesShow.layout = ({ role }: { role: ManagedRole }) => ({
    breadcrumbs: [
        {
            title: 'Roles',
            href: index(),
        },
        {
            title: role.name,
            href: show(role.id),
        },
    ],
});