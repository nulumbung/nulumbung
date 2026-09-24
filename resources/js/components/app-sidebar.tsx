import { Link } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    Images,
    LayoutGrid,
    Mail,
    Newspaper,
    ScrollText,
    Tags,
    UsersRound,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavSystem } from '@/components/nav-system';
import { NavUser } from '@/components/nav-user';
import { NavAdmin } from '@/components/nav-admin';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as categoriesIndex } from '@/routes/management/categories';
import { index as newsIndex } from '@/routes/management/news';
import { index as mediaIndex } from '@/routes/management/media';
import { index as historyIndex } from '@/routes/management/history';
import { index as banomIndex } from '@/routes/management/banom';
import { index as newsletterIndex } from '@/routes/management/newsletter';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'News',
        href: newsIndex(),
        icon: Newspaper,
        permission: 'manage-news',
    },
    {
        title: 'Media',
        href: mediaIndex(),
        icon: Images,
        permission: 'manage-media',
    },
    {
        title: 'History',
        href: historyIndex(),
        icon: ScrollText,
        permission: 'manage-history',
    },
    {
        title: 'Categories',
        href: categoriesIndex(),
        icon: Tags,
        permission: 'manage-categories',
    },
    {
        title: 'Banom',
        href: banomIndex(),
        icon: UsersRound,
        permission: 'manage-banom',
    },
    {
        title: 'Newsletter',
        href: newsletterIndex(),
        icon: Mail,
        permission: 'manage-newsletter',
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavSystem />
                <NavAdmin />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
