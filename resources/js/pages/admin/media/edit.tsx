import { Head, Link } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import MediaController from '@/actions/App/Http/Controllers/MediaController';
import { MediaFormFields } from '@/components/media-form';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { edit, index } from '@/routes/management/media';
import { editFormData, wireForm } from '@/lib/media';
import type { MediaFormData, MediaItem } from '@/lib/media';

export default function MediaEdit({ media }: { media: MediaItem }) {
    const form = useForm<MediaFormData>(editFormData(media));

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        wireForm(form);
        form.submit(MediaController.update(media));
    };

    return (
        <>
            <Head title={`Edit ${media.title}`} />

            <h1 className="sr-only">Edit {media.title}</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-3xl self-center rounded-xl">
                    <CardHeader>
                        <CardTitle>Edit media</CardTitle>
                        <CardDescription>
                            Update the media information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-6">
                            <MediaFormFields form={form} titlePrefix="edit" />

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

MediaEdit.layout = ({ media }: { media: MediaItem }) => ({
    breadcrumbs: [
        {
            title: 'Media',
            href: index(),
        },
        {
            title: media.title,
            href: edit(media.id),
        },
        {
            title: 'Edit',
            href: edit(media.id),
        },
    ],
});