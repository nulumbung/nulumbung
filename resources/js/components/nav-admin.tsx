import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { ChevronDown, KeyRound, ShieldCheck, Users } from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { index as permissionsIndex } from '@/routes/management/permissions';
import { index as rolesIndex } from '@/routes/management/roles';
import { index as usersIndex } from '@/routes/management/users';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import type { Auth } from '@/types';

export function NavAdmin() {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { auth } = usePage<{ auth?: Auth }>().props;

    const canManageUsers = auth?.permissions?.includes('manage-users');
    const canManageRoles = auth?.permissions?.includes('manage-roles');
    const canManagePermissions = auth?.permissions?.includes('manage-permissions');

    if (!canManageUsers && !canManageRoles && !canManagePermissions) {
        return null;
    }

    const usersHref = usersIndex();
    const rolesHref = rolesIndex();
    const permissionsHref = permissionsIndex();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                <Collapsible
                    asChild
                    defaultOpen={
                        isCurrentOrParentUrl(usersHref) ||
                        isCurrentOrParentUrl(rolesHref) ||
                        isCurrentOrParentUrl(permissionsHref)
                    }
                    className="group/collapsible"
                >
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                                tooltip={{ children: 'Administration' }}
                            >
                                <ShieldCheck />
                                <span>Administration</span>
                                <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {canManageUsers && (
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton
                                            asChild
                                            isActive={isCurrentOrParentUrl(
                                                usersHref,
                                            )}
                                        >
                                            <Link href={usersHref} prefetch>
                                                <Users />
                                                <span>Users</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                )}
                                {canManageRoles && (
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton
                                            asChild
                                            isActive={isCurrentOrParentUrl(
                                                rolesHref,
                                            )}
                                        >
                                            <Link href={rolesHref} prefetch>
                                                <ShieldCheck />
                                                <span>Roles</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                )}
                                {canManagePermissions && (
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton
                                            asChild
                                            isActive={isCurrentOrParentUrl(
                                                permissionsHref,
                                            )}
                                        >
                                            <Link href={permissionsHref} prefetch>
                                                <KeyRound />
                                                <span>Permissions</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                )}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            </SidebarMenu>
        </SidebarGroup>
    );
}