import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { edit, index, show } from '@/routes/management/users';
import type { User } from '@/types';

type EditUserFormData = {
    name: string;
    email: string;
    password: string;
    role: string;
};

export default function UsersEdit({
    user,
    roles,
}: {
    user: User;
    roles: string[];
}) {
    const form = useForm<EditUserFormData>({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role_names?.[0] ?? '',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.submit(UserController.update(user));
    };

    return (
        <>
            <Head title={`Edit ${user.name}`} />

            <h1 className="sr-only">Edit {user.name}</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-2xl self-center rounded-xl">
                    <CardHeader>
                        <CardTitle>Edit user</CardTitle>
                        <CardDescription>
                            Update the user information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
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
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
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
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
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

                            <div className="flex items-center gap-2">
                                <Button type="button" variant="secondary" asChild>
                                    <Link href={show(user.id)}>Cancel</Link>
                                </Button>
                                <Button
                                    disabled={form.processing}
                                    data-test="update-user-button"
                                >
                                    Save
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

UsersEdit.layout = ({ user }: { user: User }) => ({
    breadcrumbs: [
        {
            title: 'Users',
            href: index(),
        },
        {
            title: user.name,
            href: show(user.id),
        },
        {
            title: 'Edit',
            href: edit(user.id),
        },
    ],
});