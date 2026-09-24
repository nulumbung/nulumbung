import { Head, Link } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import HistoryController from '@/actions/App/Http/Controllers/HistoryController';
import { HistoryFormFields } from '@/components/history-form';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { create, index } from '@/routes/management/history';
import { emptyForm, wireForm } from '@/lib/history';
import type { HistoryFormData } from '@/lib/history';

export default function HistoryCreate() {
    const form = useForm<HistoryFormData>(emptyForm());

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        wireForm(form);
        form.submit(HistoryController.store());
    };

    return (
        <>
            <Head title="Create history" />

            <h1 className="sr-only">Create history</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-3xl self-center rounded-xl">
                    <CardHeader>
                        <CardTitle>Create history</CardTitle>
                        <CardDescription>
                            Add a new history entry to the platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-6">
                            <HistoryFormFields
                                form={form}
                                titlePrefix="create"
                            />

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    asChild
                                >
                                    <Link href={index()}>Cancel</Link>
                                </Button>
                                <Button disabled={form.processing}>
                                    Create history
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

HistoryCreate.layout = {
    breadcrumbs: [
        {
            title: 'History',
            href: index(),
        },
        {
            title: 'Create history',
            href: create(),
        },
    ],
};