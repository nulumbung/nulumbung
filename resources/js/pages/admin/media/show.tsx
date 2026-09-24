import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ImageIcon, ListOrdered, Pencil, Tag, Video } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
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
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { index } from '@/routes/management/media';
import { STATUS_OPTIONS, STATUS_VARIANT, editFormData, mediaUrl, wireForm } from '@/lib/media';
import type { MediaFormData, MediaItem } from '@/lib/media';
import '../../../../css/editor.css';

export default function MediaShow({ media }: { media: MediaItem }) {
    const [editOpen, setEditOpen] = useState(false);
    const preview =
        media.type === 'photo' ? media.preview_url : media.thumbnail_url;

    return (
        <>
            <Head title={media.title} />

            <h1 className="sr-only">{media.title}</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-3xl self-center rounded-xl">
                    <CardHeader className="space-y-4">
                        <div>
                            <Button variant="ghost" asChild className="w-fit gap-2">
                                <Link href={index()}>
                                    <ArrowLeft className="size-4" />
                                    Back to media
                                </Link>
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                    variant={
                                        STATUS_VARIANT[media.status] ?? 'outline'
                                    }
                                >
                                    {STATUS_OPTIONS.find(
                                        (option) => option.value === media.status,
                                    )?.label ?? media.status}
                                </Badge>
                                <Badge variant="secondary">
                                    {media.type === 'video' ? (
                                        <>
                                            <Video className="size-3" />
                                            Video
                                        </>
                                    ) : (
                                        <>
                                            <ImageIcon className="size-3" />
                                            Photo
                                        </>
                                    )}
                                </Badge>
                            </div>

                            <CardTitle className="text-2xl">
                                {media.title}
                            </CardTitle>

                            <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                <span className="inline-flex items-center gap-1">
                                    <ListOrdered className="size-3.5" />
                                    Order {media.sort_order}
                                </span>
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {media.type === 'video' && media.url ? (
                            media.url.includes('youtube.com') ||
                            media.url.includes('youtu.be') ? (
                                <div className="bg-muted aspect-video w-full overflow-hidden rounded-md">
                                    <iframe
                                        src={media.url
                                            .replace('watch?v=', 'embed/')}
                                        title={media.title}
                                        className="size-full"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <video
                                    src={mediaUrl(media.file ?? media.url)}
                                    controls
                                    className="bg-muted aspect-video w-full rounded-md object-contain"
                                />
                            )
                        ) : preview ? (
                            <img
                                src={preview}
                                alt={media.title}
                                className="bg-muted aspect-video w-full rounded-md object-cover"
                            />
                        ) : (
                            <div className="bg-muted text-muted-foreground flex aspect-video w-full items-center justify-center rounded-md">
                                <ImageIcon className="size-8" />
                            </div>
                        )}

                        {media.description ? (
                            <div className="tiptap">
                                <div
                                    className="ProseMirror"
                                    dangerouslySetInnerHTML={{
                                        __html: media.description,
                                    }}
                                />
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm">
                                No description provided.
                            </p>
                        )}

                        <div className="flex justify-end pt-2">
                            <Button onClick={() => setEditOpen(true)}>
                                <Pencil className="size-4" />
                                Edit media
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <EditMediaDialog
                media={media}
                open={editOpen}
                onOpenChange={setEditOpen}
            />
        </>
    );
}

function EditMediaDialog({
    media,
    open,
    onOpenChange,
}: {
    media: MediaItem;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const form = useForm<MediaFormData>(editFormData(media));

    useEffect(() => {
        form.setData(editFormData(media));
        form.clearErrors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        wireForm(form);
        form.submit(MediaController.update(media));
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                if (!open) {
                    form.reset();
                    form.clearErrors();
                }
                onOpenChange(open);
            }}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit media</DialogTitle>
                    <DialogDescription>
                        Update the media information
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6">
                    <MediaFormFields form={form} titlePrefix="edit" />

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
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

MediaShow.layout = ({ media }: { media: MediaItem }) => ({
    breadcrumbs: [
        {
            title: 'Media',
            href: index(),
        },
        {
            title: media.title,
            href: media.id,
        },
    ],
});