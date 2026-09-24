import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import Pagination, { Paginator } from '@/components/pagination';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useInitials } from '@/hooks/use-initials';
import { index, show } from '@/routes/management/users';
import type { Auth } from '@/types';

type ManagedUser = {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    created_at: string;
    roles: { id: number; name: string }[];
};

type UserFormData = {
    name: string;
    email: string;
    password: string;
    role: string;
};

const emptyForm: UserFormData = {
    name: '',
    email: '',
    password: '',
    role: '',
};

function userFormData(user: ManagedUser): UserFormData {
    return {
        name: user.name,
        email: user.email,
        password: '',
        role: user.roles[0]?.name ?? '',
    };
}

export default function UsersIndex({
    users,
    roles,
    filters,
}: {
    users: Paginator<ManagedUser>;
    roles: string[];
    filters: { search: string | null };
}) {
    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [createOpen, setCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
    const [deletingUser, setDeletingUser] = useState<ManagedUser | null>(null);

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
            <Head title="Users" />

            <h1 className="sr-only">Users</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full rounded-xl">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                            <CardTitle>Users</CardTitle>
                            <CardDescription>
                                Manage users, their roles and account access
                            </CardDescription>
                        </div>
                        <Button
                            className="hidden sm:inline-flex"
                            onClick={() => setCreateOpen(true)}
                        >
                            <Plus className="size-4" />
                            Add user
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 sm:hidden">
                            <Button
                                className="w-full"
                                onClick={() => setCreateOpen(true)}
                            >
                                <Plus className="size-4" />
                                Add user
                            </Button>
                        </div>

                        <div className="relative sm:max-w-sm">
                            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input
                                name="search"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Search users..."
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
                                            Email
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Role
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
                                    {users.data.map((user) => (
                                        <UserRow
                                            key={user.id}
                                            user={user}
                                            onEdit={() =>
                                                setEditingUser(user)
                                            }
                                            onDelete={() =>
                                                setDeletingUser(user)
                                            }
                                        />
                                    ))}
                                    {users.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="text-muted-foreground px-3 py-8 text-center"
                                            >
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination paginator={users} />
                    </CardContent>
                </Card>
            </div>

            <CreateUserDialog
                open={createOpen}
                roles={roles}
                onOpenChange={setCreateOpen}
            />

            <EditUserDialog
                user={editingUser}
                roles={roles}
                onClose={() => setEditingUser(null)}
            />

            <DeleteUserDialog
                user={deletingUser}
                onClose={() => setDeletingUser(null)}
            />
        </>
    );
}

function UserRow({
    user,
    onEdit,
    onDelete,
}: {
    user: ManagedUser;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const getInitials = useInitials();
    const { auth } = usePage<{ auth: Auth }>().props;
    const isSelf = auth.user.id === user.id;

    return (
        <tr className="border-border border-b last:border-0">
            <td className="px-3 py-3">
                <div className="flex items-center gap-3">
                    <Avatar className="bg-muted size-8 rounded-full">
                        {user.avatar && (
                            <AvatarImage
                                src={user.avatar}
                                alt={user.name}
                                className="object-cover"
                            />
                        )}
                        <AvatarFallback className="rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                </div>
            </td>
            <td className="text-muted-foreground px-3 py-3">{user.email}</td>
            <td className="px-3 py-3">
                {user.roles.length > 0 ? (
                    <Badge variant="secondary">{user.roles[0].name}</Badge>
                ) : (
                    <span className="text-muted-foreground">-</span>
                )}
            </td>
            <td className="text-muted-foreground px-3 py-3">
                {new Date(user.created_at).toLocaleDateString()}
            </td>
            <td className="px-3 py-3">
                <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                        <Link
                            href={show(user.id)}
                            aria-label={`View ${user.name}`}
                        >
                            <Eye className="size-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onEdit}
                        aria-label={`Edit ${user.name}`}
                    >
                        <Pencil className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDelete}
                        disabled={isSelf}
                        aria-label={`Delete ${user.name}`}
                        className="hover:text-destructive"
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}

function UserFormFields({
    form,
    roles,
    titlePrefix,
    isEditing,
}: {
    form: ReturnType<typeof useForm<UserFormData>>;
    roles: string[];
    titlePrefix: 'create' | 'edit';
    isEditing?: boolean;
}) {
    return (
        <div className="space-y-6">
            <div className="grid gap-2">
                <Label htmlFor={`${titlePrefix}-name`}>Name</Label>
                <Input
                    id={`${titlePrefix}-name`}
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    maxLength={255}
                    placeholder="Name"
                    autoComplete="off"
                />
                <InputError message={form.errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={`${titlePrefix}-email`}>Email</Label>
                <Input
                    id={`${titlePrefix}-email`}
                    type="email"
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                    maxLength={255}
                    placeholder="Email"
                    autoComplete="off"
                />
                <InputError message={form.errors.email} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={`${titlePrefix}-password`}>Password</Label>
                <PasswordInput
                    id={`${titlePrefix}-password`}
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.target.value)}
                    placeholder={
                        isEditing
                            ? 'Leave blank to keep the current password'
                            : undefined
                    }
                    autoComplete="new-password"
                />
                <InputError message={form.errors.password} />
            </div>

            <div className="grid gap-2">
                <Label>Role</Label>
                <Select
                    value={form.data.role}
                    onValueChange={(value) => form.setData('role', value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                                {role}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={form.errors.role} />
            </div>
        </div>
    );
}

function CreateUserDialog({
    open,
    roles,
    onOpenChange,
}: {
    open: boolean;
    roles: string[];
    onOpenChange: (open: boolean) => void;
}) {
    const form = useForm<UserFormData>(emptyForm);

    useEffect(() => {
        if (form.wasSuccessful) {
            form.reset();
            form.clearErrors();
            onOpenChange(false);
        }
    }, [form.wasSuccessful]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.submit(UserController.store());
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
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create user</DialogTitle>
                    <DialogDescription>
                        Add a new user to the platform
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6">
                    <UserFormFields form={form} roles={roles} titlePrefix="create" />

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
                            data-test="create-user-button"
                        >
                            Create user
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditUserDialog({
    user,
    roles,
    onClose,
}: {
    user: ManagedUser | null;
    roles: string[];
    onClose: () => void;
}) {
    const form = useForm<UserFormData>(emptyForm);

    useEffect(() => {
        if (user) {
            form.setData(userFormData(user));
            form.clearErrors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    useEffect(() => {
        if (form.wasSuccessful) {
            form.reset();
            form.clearErrors();
            onClose();
        }
    }, [form.wasSuccessful]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (user) {
            form.submit(UserController.update(user));
        }
    };

    return (
        <Dialog
            open={user !== null}
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
                    <DialogTitle>Edit user</DialogTitle>
                    <DialogDescription>
                        Update the user information
                    </DialogDescription>
                </DialogHeader>

                {user && (
                    <form onSubmit={onSubmit} className="space-y-6">
                        <UserFormFields
                            form={form}
                            roles={roles}
                            titlePrefix="edit"
                            isEditing
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
                            <Button
                                type="submit"
                                disabled={form.processing}
                                data-test="update-user-button"
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

function DeleteUserDialog({
    user,
    onClose,
}: {
    user: ManagedUser | null;
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

        if (user) {
            form.submit(UserController.destroy(user));
        }
    };

    return (
        <Dialog
            open={user !== null}
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
                    <DialogTitle>Delete user</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this user? This action
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {user && (
                    <>
                        <div className="rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-200/10 dark:bg-red-700/10 dark:text-red-100">
                            {user.name} · {user.email}
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
                                    Delete user
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: index(),
        },
    ],
};