import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { ImageIcon, Video } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { lazy, Suspense, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { TYPE_OPTIONS, mediaUrl, youtubeThumbnail } from '@/lib/media';
import type { MediaForm, MediaType } from '@/lib/media';
import { uploadMediaFile, uploadMediaThumbnail } from '@/lib/upload-media';
import { toast } from 'sonner';

const RichTextEditor = lazy(() =>
    import('@/components/editor/rich-text-editor').then((module) => ({
        default: module.RichTextEditor,
    })),
);

const STATUS_OPTIONS = [
    { value: 'publish', label: 'Publish' },
    { value: 'archive', label: 'Archive' },
    { value: 'draft', label: 'Draft' },
] as const;

function MediaFormFields({
    form,
    titlePrefix,
}: {
    form: MediaForm;
    titlePrefix: 'create' | 'edit';
}) {
    const [uploadingFile, setUploadingFile] = useState(false);
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);
    const thumbnailInput = useRef<HTMLInputElement>(null);

    const hasUrl = form.data.url.trim() !== '';
    const isVideo = form.data.type === 'video';
    const autoThumbnail = isVideo ? youtubeThumbnail(form.data.url) : null;

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) {
            return;
        }

        setUploadingFile(true);

        try {
            const path = await uploadMediaFile(file);
            form.setData('file', path);
            form.setData('url', '');
        } catch {
            toast.error('Media upload failed');
        } finally {
            setUploadingFile(false);
        }
    };

    const handleThumbnailUpload = async (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) {
            return;
        }

        setUploadingThumbnail(true);

        try {
            const path = await uploadMediaThumbnail(file);
            form.setData('thumbnail', path);
        } catch {
            toast.error('Image upload failed');
        } finally {
            setUploadingThumbnail(false);
        }
    };

    return (
        <div className="space-y-6">
            <fieldset className="space-y-4">
                <legend className="text-foreground text-sm font-semibold">
                    Media content
                </legend>

                <div className="grid gap-2">
                    <Label htmlFor={`${titlePrefix}-title`}>
                        Media title
                    </Label>
                    <Input
                        id={`${titlePrefix}-title`}
                        value={form.data.title}
                        onChange={(e) => form.setData('title', e.target.value)}
                        autoComplete="off"
                    />
                    <InputError message={form.errors.title} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor={`${titlePrefix}-type`}>
                        Media type
                    </Label>
                    <Select
                        value={form.data.type}
                        onValueChange={(value) => {
                            form.setData('type', value as MediaType);

                            if (value !== 'video') {
                                form.setData('thumbnail', '');
                            }
                        }}
                    >
                        <SelectTrigger id={`${titlePrefix}-type`}>
                            <SelectValue placeholder="Media type" />
                        </SelectTrigger>
                        <SelectContent>
                            {TYPE_OPTIONS.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={form.errors.type} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor={`${titlePrefix}-url`}>
                        Media URL
                    </Label>
                    <Input
                        id={`${titlePrefix}-url`}
                        value={form.data.url}
                        onChange={(e) => {
                            const value = e.target.value;
                            form.setData('url', value);

                            if (value.trim() !== '') {
                                form.setData('file', '');
                            }
                        }}
                        placeholder="https://example.com/media"
                        autoComplete="off"
                    />
                    <p className="text-muted-foreground text-xs">
                        Use a media URL or upload a file below. A YouTube link
                        fills the thumbnail automatically.
                    </p>
                    <InputError message={form.errors.url} />
                </div>

                {hasUrl ? (
                    <div className="bg-muted/50 text-muted-foreground rounded-md border border-dashed p-4 text-sm">
                        File upload is not required because a media URL is
                        provided.
                    </div>
                ) : (
                    <div className="grid gap-2">
                        <Label>
                            {isVideo ? 'Video file' : 'Photo file'}
                        </Label>
                        {form.data.file ? (
                            <div className="flex items-start gap-3">
                                {isVideo ? (
                                    <video
                                        src={mediaUrl(form.data.file)}
                                        controls
                                        className="bg-muted h-28 w-44 rounded-md object-cover"
                                    />
                                ) : (
                                    <img
                                        src={mediaUrl(form.data.file)}
                                        alt=""
                                        className="bg-muted h-28 w-44 rounded-md object-cover"
                                    />
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => form.setData('file', '')}
                                >
                                    Remove file
                                </Button>
                            </div>
                        ) : (
                            <Label
                                htmlFor={`${titlePrefix}-file`}
                                className="border-muted text-muted-foreground hover:bg-muted/50 flex h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed"
                            >
                                {isVideo ? (
                                    <Video className="size-6" />
                                ) : (
                                    <ImageIcon className="size-6" />
                                )}
                                <span className="text-sm">
                                    {uploadingFile
                                        ? 'Uploading...'
                                        : isVideo
                                          ? 'Click to upload a video'
                                          : 'Click to upload a photo'}
                                </span>
                            </Label>
                        )}
                        <input
                            ref={fileInput}
                            id={`${titlePrefix}-file`}
                            type="file"
                            accept={isVideo ? 'video/*' : 'image/*'}
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                        <InputError message={form.errors.file} />
                    </div>
                )}

                {isVideo && (
                    <div className="grid gap-2">
                        <Label>Video thumbnail</Label>

                        {form.data.thumbnail ? (
                            <div className="flex items-center gap-3">
                                <img
                                    src={mediaUrl(form.data.thumbnail)}
                                    alt=""
                                    className="bg-muted h-24 w-40 rounded-md object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        form.setData('thumbnail', '')
                                    }
                                >
                                    Remove thumbnail
                                </Button>
                            </div>
                        ) : autoThumbnail ? (
                            <div className="flex items-center gap-3">
                                <img
                                    src={autoThumbnail}
                                    alt=""
                                    className="bg-muted h-24 w-40 rounded-md object-cover"
                                />
                                <span className="text-muted-foreground text-xs">
                                    Thumbnail is filled automatically from the
                                    YouTube link.
                                </span>
                            </div>
                        ) : (
                            <Label
                                htmlFor={`${titlePrefix}-thumbnail`}
                                className="border-muted text-muted-foreground hover:bg-muted/50 flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed"
                            >
                                <ImageIcon className="size-5" />
                                <span className="text-xs">
                                    {uploadingThumbnail
                                        ? 'Uploading...'
                                        : 'Click to upload a custom thumbnail (optional)'}
                                </span>
                            </Label>
                        )}

                        {form.data.thumbnail && (
                            <Label
                                htmlFor={`${titlePrefix}-thumbnail`}
                                className="text-muted-foreground w-fit cursor-pointer text-xs underline"
                            >
                                Replace thumbnail
                            </Label>
                        )}

                        <input
                            ref={thumbnailInput}
                            id={`${titlePrefix}-thumbnail`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleThumbnailUpload}
                        />
                        <InputError message={form.errors.thumbnail} />
                    </div>
                )}

                <div className="grid gap-2">
                    <Label>Description</Label>
                    <Suspense
                        fallback={
                            <Skeleton className="h-64 w-full rounded-md" />
                        }
                    >
                        <RichTextEditor
                            value={form.data.description}
                            onChange={(html) =>
                                form.setData('description', html)
                            }
                            placeholder="Describe the media..."
                        />
                    </Suspense>
                    <InputError message={form.errors.description} />
                </div>
            </fieldset>

            <fieldset className="space-y-4">
                <legend className="text-foreground text-sm font-semibold">
                    Placement
                </legend>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor={`${titlePrefix}-sort-order`}>
                            Order
                        </Label>
                        <Input
                            id={`${titlePrefix}-sort-order`}
                            type="number"
                            min={0}
                            value={form.data.sort_order}
                            onChange={(e) =>
                                form.setData('sort_order', e.target.value)
                            }
                            placeholder="Position in the list"
                        />
                        <InputError message={form.errors.sort_order} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor={`${titlePrefix}-status`}>
                            Status
                        </Label>
                        <Select
                            value={form.data.status}
                            onValueChange={(value) =>
                                form.setData('status', value)
                            }
                        >
                            <SelectTrigger id={`${titlePrefix}-status`}>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.status} />
                    </div>
                </div>
            </fieldset>
        </div>
    );
}

export { MediaFormFields };