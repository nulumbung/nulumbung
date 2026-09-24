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
import { create, index } from '@/routes/management/roles';

export default function RolesCreate({
    permissions,
}: {
    permissions: PermissionOption[];
}) {
    const form = useForm<{ name: string; permissions: string[] }>({
        name: '',
        permissions: [],
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.submit(RoleController.store());
    };

    return (
        <>
            <Head title="Create role" />

            <h1 className="sr-only">Create role</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-2xl self-center rounded-xl">
                    <CardHeader>
                        <CardTitle>Create role</CardTitle>
                        <CardDescription>
                            Add a new role to the platform and choose its
                            permissions
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
                                />
                                <InputError message={form.errors.name} />
                            </div>

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

                            <div className="flex items-center gap-2">
                                <Button type="button" variant="secondary" asChild>
                                    <Link href={index()}>Cancel</Link>
                                </Button>
                                <Button
                                    disabled={form.processing}
                                    data-test="create-role-button"
                                >
                                    Create role
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

RolesCreate.layout = {
    breadcrumbs: [
        {
            title: 'Roles',
            href: index(),
        },
        {
            title: 'Create role',
            href: create(),
        },
    ],
};