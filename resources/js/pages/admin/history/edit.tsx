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
import { edit, index } from '@/routes/management/history';
import { editFormData, wireForm } from '@/lib/history';
import type { HistoryFormData, HistoryItem } from '@/lib/history';

export default function HistoryEdit({ history }: { history: HistoryItem }) {
    const form = useForm<HistoryFormData>(editFormData(history));

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        wireForm(form);
        form.submit(HistoryController.update(history));
    };

    return (
        <>
            <Head title={`Edit ${history.title}`} />

            <h1 className="sr-only">Edit {history.title}</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-3xl self-center rounded-xl">
                    <CardHeader>
                        <CardTitle>Edit history</CardTitle>
                        <CardDescription>
                            Update the history information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-6">
                            <HistoryFormFields
                                form={form}
                                titlePrefix="edit"
                            />

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    asChild
                                >
                                    <Link href={index()}>Cancel</Link>
                                </Button>
                                <Button disabled={form.processing}>Save</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

HistoryEdit.layout = ({ history }: { history: HistoryItem }) => ({
    breadcrumbs: [
        {
            title: 'History',
            href: index(),
        },
        {
            title: history.title,
            href: edit(history.id),
        },
        {
            title: 'Edit',
            href: edit(history.id),
        },
    ],
});