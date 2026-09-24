import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Calendar, Mail, Pencil, Trash2 } from 'lucide-react';
import UserController from '@/actions/App/Http/Controllers/UserController';
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
import type { Auth, User } from '@/types';
import { usePage } from '@inertiajs/react';

type EditUserFormData = {
    name: string;
    email: string;
    password: string;
    role: string;
};

export default function UsersShow({ user, roles }: { user: User; roles: string[] }) {
    const getInitials = useInitials();
    const { auth } = usePage<{ auth: Auth }>().props;
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const isSelf = auth.user.id === user.id;

    const form = useForm<Record<string, never>>({});

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.submit(UserController.destroy(user));
    };

    return (
        <>
            <Head title={user.name} />

            <h1 className="sr-only">{user.name}</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-2xl self-center rounded-xl">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="bg-muted size-14 rounded-full">
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
                            <div className="space-y-1">
                                <CardTitle>{user.name}</CardTitle>
                                <CardDescription>
                                    {user.role_names?.length
                                        ? user.role_names.join(', ')
                                        : 'No role assigned'}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" asChild>
                                <Link href={index()}>Back</Link>
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => setEditOpen(true)}
                            >
                                <Pencil className="size-4" />
                                Edit
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => setDeleteOpen(true)}
                                disabled={isSelf}
                                data-test="delete-user-button"
                            >
                                <Trash2 className="size-4" />
                                Delete
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-center gap-3 rounded-lg border p-4">
                                <Mail className="text-muted-foreground size-4 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-muted-foreground text-sm">
                                        Email
                                    </p>
                                    <p className="truncate text-sm font-medium">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg border p-4">
                                <Calendar className="text-muted-foreground size-4 shrink-0" />
                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Member since
                                    </p>
                                    <p className="text-sm font-medium">
                                        {new Date(
                                            user.created_at,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <p className="text-muted-foreground text-sm">
                                {isSelf
                                    ? 'This is your own account. You cannot delete it.'
                                    : 'Delete this user and revoke their account access.'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete user</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this user? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-200/10 dark:bg-red-700/10 dark:text-red-100">
                        {user.name} · {user.email}
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
                                Delete user
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <EditUserDialog
                user={user}
                roles={roles}
                open={editOpen}
                onOpenChange={setEditOpen}
            />
        </>
    );
}

function EditUserDialog({
    user,
    roles,
    open,
    onOpenChange,
}: {
    user: User;
    roles: string[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const form = useForm<EditUserFormData>({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role_names?.[0] ?? '',
    });

    useEffect(() => {
        form.setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role_names?.[0] ?? '',
        });
        form.clearErrors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.submit(UserController.update(user));
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
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Edit user</DialogTitle>
                    <DialogDescription>
                        Update the user information
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-username">Name</Label>
                            <Input
                                id="edit-username"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                maxLength={255}
                                placeholder="Name"
                                autoComplete="off"
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-useremail">Email</Label>
                            <Input
                                id="edit-useremail"
                                type="email"
                                value={form.data.email}
                                onChange={(e) =>
                                    form.setData('email', e.target.value)
                                }
                                maxLength={255}
                                placeholder="Email"
                                autoComplete="off"
                            />
                            <InputError message={form.errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-userpassword">Password</Label>
                            <PasswordInput
                                id="edit-userpassword"
                                value={form.data.password}
                                onChange={(e) =>
                                    form.setData('password', e.target.value)
                                }
                                placeholder="Leave blank to keep the current password"
                                autoComplete="new-password"
                            />
                            <InputError message={form.errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Role</Label>
                            <Select
                                value={form.data.role}
                                onValueChange={(value) =>
                                    form.setData('role', value)
                                }
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
                            data-test="update-user-button"
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

UsersShow.layout = ({ user }: { user: User }) => ({
    breadcrumbs: [
        {
            title: 'Users',
            href: index(),
        },
        {
            title: user.name,
            href: show(user.id),
        },
    ],
});