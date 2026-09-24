import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { ChevronDown, Globe, Settings } from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { edit as platformEdit } from '@/routes/system/platform';
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

export function NavSystem() {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { auth } = usePage<{ auth?: Auth }>().props;

    if (!auth?.permissions?.includes('manage-system')) {
        return null;
    }

    const platformHref = platformEdit();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                <Collapsible
                    asChild
                    defaultOpen={isCurrentOrParentUrl(platformHref)}
                    className="group/collapsible"
                >
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={{ children: 'System' }}>
                                <Settings />
                                <span>System</span>
                                <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton
                                        asChild
                                        isActive={isCurrentOrParentUrl(
                                            platformHref,
                                        )}
                                    >
                                        <Link href={platformHref} prefetch>
                                            <Globe />
                                            <span>Platform</span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            </SidebarMenu>
        </SidebarGroup>
    );
}