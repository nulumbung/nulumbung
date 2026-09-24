import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import RoleController from '@/actions/App/Http/Controllers/RoleController';
import { PermissionPicker, type PermissionOption } from '@/components/permission-picker';
import InputError from '@/components/input-error';
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
import { edit, index, show } from '@/routes/management/roles';

type ManagedRole = {
    id: number;
    name: string;
    permission_names: string[];
};

export default function RolesEdit({
    role,
    permissions,
}: {
    role: ManagedRole;
    permissions: PermissionOption[];
}) {
    const isSuperadmin = role.name === 'superadmin';
    const form = useForm<{ name: string; permissions: string[] }>({
        name: role.name,
        permissions: role.permission_names,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.submit(RoleController.update(role));
    };

    return (
        <>
            <Head title={`Edit ${role.name}`} />

            <h1 className="sr-only">Edit {role.name}</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-2xl self-center rounded-xl">
                    <CardHeader>
                        <CardTitle>Edit role</CardTitle>
                        <CardDescription>
                            Update the role information and permissions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Role name</Label>
                                <Input
                                    id="name"
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
                                    <div>
                                        <Label>Permissions</Label>
                                        <p className="text-muted-foreground text-sm">
                                            Grant access to the management
                                            sections below
                                        </p>
                                    </div>
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

                            {isSuperadmin && (
                                <p className="text-muted-foreground text-sm">
                                    The superadmin role always has full access
                                    and cannot be changed.
                                </p>
                            )}

                            <div className="flex items-center gap-2">
                                <Button type="button" variant="secondary" asChild>
                                    <Link href={show(role.id)}>Cancel</Link>
                                </Button>
                                <Button
                                    disabled={form.processing || isSuperadmin}
                                    data-test="update-role-button"
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

RolesEdit.layout = ({ role }: { role: ManagedRole }) => ({
    breadcrumbs: [
        {
            title: 'Roles',
            href: index(),
        },
        {
            title: role.name,
            href: show(role.id),
        },
        {
            title: 'Edit',
            href: edit(role.id),
        },
    ],
});