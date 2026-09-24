import { Head, router } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import { Fragment, useMemo, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { update } from '@/actions/App/Http/Controllers/PermissionController';
import type { PermissionOption } from '@/components/permission-picker';
import { index } from '@/routes/management/permissions';

type RolePermissionRow = {
    id: number;
    name: string;
    permission_names: string[];
};

export default function PermissionIndex({
    permissions,
    roles,
}: {
    permissions: PermissionOption[];
    roles: RolePermissionRow[];
}) {
    const [pending, setPending] = useState<Record<number, string[] | undefined>>(
        {},
    );

    const groups = useMemo(() => {
        const grouped = new Map<string, PermissionOption[]>();

        for (const permission of permissions) {
            const list = grouped.get(permission.group) ?? [];
            list.push(permission);
            grouped.set(permission.group, list);
        }

        return Array.from(grouped.entries());
    }, [permissions]);

    const assign = (
        role: RolePermissionRow,
        permissionValue: string,
        currentlyChecked: boolean,
    ) => {
        const base = pending[role.id] ?? role.permission_names;
        const next = currentlyChecked
            ? base.filter((name) => name !== permissionValue)
            : [...base, permissionValue].sort();

        setPending((state) => ({ ...state, [role.id]: next }));

        router.patch(
            update(role),
            { permissions: next },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () =>
                    setPending((state) => ({ ...state, [role.id]: undefined })),
                onError: () =>
                    setPending((state) => ({ ...state, [role.id]: undefined })),
            },
        );
    };

    return (
        <>
            <Head title="Permissions" />

            <h1 className="sr-only">Permissions</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full rounded-xl">
                    <CardHeader>
                        <CardTitle>Permissions</CardTitle>
                        <CardDescription>
                            Assign each section's access to the roles below. The
                            superadmin role is locked and always has every
                            permission.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-border border-b">
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Permission
                                        </th>
                                        {roles.map((role) => (
                                            <th
                                                key={role.id}
                                                className="text-muted-foreground px-3 py-2 text-center font-medium"
                                            >
                                                <span className="inline-flex items-center gap-1">
                                                    {role.name}
                                                    {role.name ===
                                                        'superadmin' && (
                                                        <Lock className="size-3" />
                                                    )}
                                                </span>
                                            </th>
                                        ))}
                                        {roles.length === 0 && (
                                            <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                                No roles
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {groups.map(([group, options]) => (
                                        <Fragment key={group}>
                                            <tr>
                                                <td
                                                    colSpan={roles.length + 1}
                                                    className="bg-muted/60 text-muted-foreground px-3 py-1.5 text-xs font-semibold tracking-wide uppercase"
                                                >
                                                    {group}
                                                </td>
                                            </tr>
                                            {options.map((permission) => (
                                                <tr
                                                    key={permission.value}
                                                    className="border-border border-b last:border-0"
                                                >
                                                    <td className="px-3 py-2.5">
                                                        <span className="font-medium">
                                                            {permission.label}
                                                        </span>
                                                        <span className="text-muted-foreground ml-2 font-mono text-xs">
                                                            {permission.value}
                                                        </span>
                                                    </td>
                                                    {roles.map((role) => {
                                                        const isSuperadmin =
                                                            role.name ===
                                                            'superadmin';
                                                        const checked = (
                                                            pending[role.id] ??
                                                            role.permission_names
                                                        ).includes(
                                                            permission.value,
                                                        );

                                                        return (
                                                            <td
                                                                key={role.id}
                                                                className="px-3 py-2.5 text-center"
                                                            >
                                                                {isSuperadmin ? (
                                                                    <span className="text-muted-foreground/50">
                                                                        <Lock className="mx-auto size-4" />
                                                                        <span className="sr-only">
                                                                            Locked
                                                                        </span>
                                                                    </span>
                                                                ) : (
                                                                    <Checkbox
                                                                        checked={
                                                                            checked
                                                                        }
                                                                        disabled={
                                                                            pending[
                                                                                role
                                                                                    .id
                                                                            ] !==
                                                                            undefined
                                                                        }
                                                                        onCheckedChange={(
                                                                            value,
                                                                        ) =>
                                                                            assign(
                                                                                role,
                                                                                permission.value,
                                                                                value ===
                                                                                    true,
                                                                            )
                                                                        }
                                                                        aria-label={`${permission.label} for ${role.name}`}
                                                                    />
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </Fragment>
                                    ))}
                                    {groups.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={roles.length + 1}
                                                className="text-muted-foreground px-3 py-8 text-center"
                                            >
                                                No permissions found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <p className="text-muted-foreground mt-2 text-xs">
                                    Tip: a permission grants access to a section
                                    across the whole app.
                                </p>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Lock icon means a locked role</span>
                            </TooltipContent>
                        </Tooltip>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PermissionIndex.layout = {
    breadcrumbs: [
        {
            title: 'Permissions',
            href: index(),
        },
    ],
};