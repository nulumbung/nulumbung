<?php

namespace App\Enums;

enum Permission: string
{
    case ManageSystem = 'manage-system';
    case ManageUsers = 'manage-users';
    case ManageRoles = 'manage-roles';
    case ManagePermissions = 'manage-permissions';
    case ManageCategories = 'manage-categories';
    case ManageNews = 'manage-news';
    case ManageMedia = 'manage-media';
    case ManageHistory = 'manage-history';
    case ManageBanom = 'manage-banom';
    case ManageNewsletter = 'manage-newsletter';

    /**
     * The label describing this permission.
     */
    public function label(): string
    {
        return match ($this) {
            self::ManageSystem => 'System',
            self::ManageUsers => 'Users',
            self::ManageRoles => 'Roles',
            self::ManagePermissions => 'Permissions',
            self::ManageCategories => 'Categories',
            self::ManageNews => 'News',
            self::ManageMedia => 'Media',
            self::ManageHistory => 'History',
            self::ManageBanom => 'Banom',
            self::ManageNewsletter => 'Newsletter',
        };
    }

    /**
     * The group this permission belongs to.
     */
    public function group(): string
    {
        return match ($this) {
            self::ManageSystem => 'System',
            self::ManageUsers, self::ManageRoles, self::ManagePermissions => 'Access Control',
            self::ManageCategories, self::ManageNews, self::ManageMedia, self::ManageHistory => 'Content',
            self::ManageBanom => 'Organization',
            self::ManageNewsletter => 'Communication',
        };
    }

    /**
     * The selectable options used by the role permission picker.
     *
     * @return array<int, array{value: string, label: string, group: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $permission): array => [
                'value' => $permission->value,
                'label' => $permission->label(),
                'group' => $permission->group(),
            ],
            self::cases(),
        );
    }
}
