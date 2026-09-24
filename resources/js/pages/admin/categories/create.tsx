import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import CategoryController from '@/actions/App/Http/Controllers/CategoryController';
import { IconPicker } from '@/components/icon-picker';
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
import { Textarea } from '@/components/ui/textarea';
import { create, index } from '@/routes/management/categories';

export default function CategoriesCreate() {
    const form = useForm<{
        name: string;
        slug: string;
        icon: string;
        comment: string;
    }>({ name: '', slug: '', icon: '', comment: '' });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.submit(CategoryController.store());
    };

    return (
        <>
            <Head title="Create category" />

            <h1 className="sr-only">Create category</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-2xl self-center rounded-xl">
                    <CardHeader>
                        <CardTitle>Create category</CardTitle>
                        <CardDescription>
                            Add a new category to the platform
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
                                    placeholder="Category name"
                                    autoComplete="off"
                                />
                                <InputError message={form.errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={form.data.slug}
                                    onChange={(e) =>
                                        form.setData('slug', e.target.value)
                                    }
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
                                    onChange={(value) =>
                                        form.setData('icon', value)
                                    }
                                />
                                <InputError message={form.errors.icon} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="comment">Comment</Label>
                                <Textarea
                                    id="comment"
                                    value={form.data.comment}
                                    onChange={(e) =>
                                        form.setData('comment', e.target.value)
                                    }
                                    placeholder="Optional description for this category"
                                />
                                <InputError message={form.errors.comment} />
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    asChild
                                >
                                    <Link href={index()}>Cancel</Link>
                                </Button>
                                <Button disabled={form.processing}>
                                    Create category
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CategoriesCreate.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: index(),
        },
        {
            title: 'Create category',
            href: create(),
        },
    ],
};