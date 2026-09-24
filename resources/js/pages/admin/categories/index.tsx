import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import CategoryController from '@/actions/App/Http/Controllers/CategoryController';
import { CategoryIcon } from '@/components/category-icon';
import { IconPicker } from '@/components/icon-picker';
import InputError from '@/components/input-error';
import Pagination, { Paginator } from '@/components/pagination';
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
import { Textarea } from '@/components/ui/textarea';
import { index } from '@/routes/management/categories';

type ManagedCategory = {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    comment: string | null;
    created_at: string;
};

type CategoryFormData = {
    name: string;
    slug: string;
    icon: string;
    comment: string;
};

const emptyForm: CategoryFormData = {
    name: '',
    slug: '',
    icon: '',
    comment: '',
};

function categoryFormData(category: ManagedCategory | null): CategoryFormData {
    if (!category) {
        return emptyForm;
    }

    return {
        name: category.name,
        slug: category.slug,
        icon: category.icon ?? '',
        comment: category.comment ?? '',
    };
}

export default function CategoriesIndex({
    categories,
    filters,
}: {
    categories: Paginator<ManagedCategory>;
    filters: { search: string | null };
}) {
    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [createOpen, setCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] =
        useState<ManagedCategory | null>(null);
    const [deletingCategory, setDeletingCategory] =
        useState<ManagedCategory | null>(null);

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
            <Head title="Categories" />

            <h1 className="sr-only">Categories</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full rounded-xl">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                            <CardTitle>Categories</CardTitle>
                            <CardDescription>
                                Organize content into categories
                            </CardDescription>
                        </div>
                        <Button
                            className="hidden sm:inline-flex"
                            onClick={() => setCreateOpen(true)}
                        >
                            <Plus className="size-4" />
                            Add category
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 sm:hidden">
                            <Button
                                className="w-full"
                                onClick={() => setCreateOpen(true)}
                            >
                                <Plus className="size-4" />
                                Add category
                            </Button>
                        </div>

                        <div className="relative sm:max-w-sm">
                            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input
                                name="search"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Search categories..."
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
                                            Slug
                                        </th>
                                        <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                                            Comment
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
                                    {categories.data.map((category) => (
                                        <CategoryRow
                                            key={category.id}
                                            category={category}
                                            onEdit={() =>
                                                setEditingCategory(category)
                                            }
                                            onDelete={() =>
                                                setDeletingCategory(category)
                                            }
                                        />
                                    ))}
                                    {categories.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="text-muted-foreground px-3 py-8 text-center"
                                            >
                                                No categories found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination paginator={categories} />
                    </CardContent>
                </Card>
            </div>

            <CreateCategoryDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
            />

            <EditCategoryDialog
                category={editingCategory}
                onClose={() => setEditingCategory(null)}
            />

            <DeleteCategoryDialog
                category={deletingCategory}
                onClose={() => setDeletingCategory(null)}
            />
        </>
    );
}

function CategoryRow({
    category,
    onEdit,
    onDelete,
}: {
    category: ManagedCategory;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <tr className="border-border border-b last:border-0">
            <td className="px-3 py-3">
                <div className="flex items-center gap-3">
                    <span className="bg-muted flex size-8 items-center justify-center rounded-md">
                        <CategoryIcon
                            name={category.icon}
                            className="text-foreground size-4"
                        />
                    </span>
                    <span className="font-medium">{category.name}</span>
                </div>
            </td>
            <td className="text-muted-foreground px-3 py-3">{category.slug}</td>
            <td className="text-muted-foreground max-w-64 truncate px-3 py-3">
                {category.comment || '-'}
            </td>
            <td className="text-muted-foreground px-3 py-3">
                {new Date(category.created_at).toLocaleDateString()}
            </td>
            <td className="px-3 py-3">
                <div className="flex items-center justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onEdit}
                        aria-label={`Edit ${category.name}`}
                    >
                        <Pencil className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDelete}
                        aria-label={`Delete ${category.name}`}
                        className="hover:text-destructive"
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}

function CategoryFormFields({
    form,
    titlePrefix,
}: {
    form: ReturnType<typeof useForm<CategoryFormData>>;
    titlePrefix: 'create' | 'edit';
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
                    placeholder="Category name"
                    autoComplete="off"
                />
                <InputError message={form.errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={`${titlePrefix}-slug`}>Slug</Label>
                <Input
                    id={`${titlePrefix}-slug`}
                    value={form.data.slug}
                    onChange={(e) => form.setData('slug', e.target.value)}
                    maxLength={255}
                    placeholder="Optional, generated from the name"
                    autoComplete="off"
                />
                <InputError message={form.errors.slug} />
            </div>

            <div className="grid gap-2">
                <Label>Icon</Label>
                <IconPicker
                    value={form.data.icon}
                    onChange={(value) => form.setData('icon', value)}
                />
                <InputError message={form.errors.icon} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={`${titlePrefix}-comment`}>Comment</Label>
                <Textarea
                    id={`${titlePrefix}-comment`}
                    value={form.data.comment}
                    onChange={(e) => form.setData('comment', e.target.value)}
                    placeholder="Optional description for this category"
                />
                <InputError message={form.errors.comment} />
            </div>
        </div>
    );
}

function CreateCategoryDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const form = useForm<CategoryFormData>(emptyForm);

    useEffect(() => {
        if (form.wasSuccessful) {
            form.reset();
            form.clearErrors();
            onOpenChange(false);
        }
    }, [form.wasSuccessful]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.submit(CategoryController.store());
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
                    <DialogTitle>Create category</DialogTitle>
                    <DialogDescription>
                        Add a new category to the platform
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6">
                    <CategoryFormFields form={form} titlePrefix="create" />

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
                        <Button type="submit" disabled={form.processing}>
                            Create category
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditCategoryDialog({
    category,
    onClose,
}: {
    category: ManagedCategory | null;
    onClose: () => void;
}) {
    const form = useForm<CategoryFormData>(categoryFormData(category));

    useEffect(() => {
        if (category) {
            form.setData(categoryFormData(category));
            form.clearErrors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category?.id]);

    useEffect(() => {
        if (form.wasSuccessful) {
            form.reset();
            form.clearErrors();
            onClose();
        }
    }, [form.wasSuccessful]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (category) {
            form.submit(CategoryController.update(category));
        }
    };

    return (
        <Dialog
            open={category !== null}
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
                    <DialogTitle>Edit category</DialogTitle>
                    <DialogDescription>
                        Update the category information
                    </DialogDescription>
                </DialogHeader>

                {category && (
                    <form onSubmit={onSubmit} className="space-y-6">
                        <CategoryFormFields form={form} titlePrefix="edit" />

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
                            <Button type="submit" disabled={form.processing}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}

function DeleteCategoryDialog({
    category,
    onClose,
}: {
    category: ManagedCategory | null;
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

        if (category) {
            form.submit(CategoryController.destroy(category));
        }
    };

    return (
        <Dialog
            open={category !== null}
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
                    <DialogTitle>Delete category</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this category? This
                        action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {category && (
                    <>
                        <div className="flex items-center gap-3 rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-200/10 dark:bg-red-700/10 dark:text-red-100">
                            <CategoryIcon name={category.icon} />
                            <span className="font-medium">{category.name}</span>
                            <span className="text-muted-foreground">
                                {category.slug}
                            </span>
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
                                    Delete category
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: index(),
        },
    ],
};