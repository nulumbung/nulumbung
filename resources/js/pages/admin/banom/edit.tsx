import { Head, Link } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import BanomController from '@/actions/App/Http/Controllers/BanomController';
import { BanomFormFields } from '@/components/banom-form';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { index } from '@/routes/management/banom';
import { editBanomFormData, wireBanomForm } from '@/lib/banom';
import type { BanomFormData, BanomItem } from '@/lib/banom';

export default function BanomEdit({ banom }: { banom: BanomItem }) {
    const form = useForm<BanomFormData>(editBanomFormData(banom));

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        wireBanomForm(form);
        form.submit(BanomController.update(banom));
    };

    return (
        <>
            <Head title="Edit banom" />

            <h1 className="sr-only">Edit banom</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-2xl self-center rounded-xl">
                    <CardHeader>
                        <CardTitle>Edit banom</CardTitle>
                        <CardDescription>
                            Update the banom information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-6">
                            <BanomFormFields form={form} titlePrefix="edit" />

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

BanomEdit.layout = {
    breadcrumbs: [
        {
            title: 'Banom',
            href: index(),
        },
        {
            title: 'Edit banom',
            href: index(),
        },
    ],
};