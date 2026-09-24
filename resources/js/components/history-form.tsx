import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { lazy, Suspense, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { uploadHistoryImage } from '@/lib/upload-history-image';
import type { HistoryForm } from '@/lib/history';
import { toast } from 'sonner';

const RichTextEditor = lazy(() =>
    import('@/components/editor/rich-text-editor').then((module) => ({
        default: module.RichTextEditor,
    })),
);

function HistoryFormFields({
    form,
    titlePrefix,
}: {
    form: HistoryForm;
    titlePrefix: 'create' | 'edit';
}) {
    const [uploading, setUploading] = useState(false);
    const imageInput = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) {
            return;
        }

        setUploading(true);

        try {
            const path = await uploadHistoryImage(file);
            form.setData('image', path);
        } catch {
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <fieldset className="space-y-4">
                <legend className="text-foreground text-sm font-semibold">
                    History information
                </legend>

                <div className="grid gap-2">
                    <Label htmlFor={`${titlePrefix}-title`}>
                        History title
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
                    <Label htmlFor={`${titlePrefix}-year`}>Year</Label>
                    <Input
                        id={`${titlePrefix}-year`}
                        value={form.data.year}
                        onChange={(e) => form.setData('year', e.target.value)}
                        placeholder="For example: 1945"
                        autoComplete="off"
                    />
                    <InputError message={form.errors.year} />
                </div>

                <div className="grid gap-2">
                    <Label>History image</Label>
                    {form.data.image ? (
                        <div className="flex items-center gap-3">
                            <img
                                src={`/storage/${form.data.image}`}
                                alt=""
                                className="bg-muted h-28 w-44 rounded-md object-cover"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => form.setData('image', '')}
                            >
                                Remove image
                            </Button>
                        </div>
                    ) : (
                        <Label
                            htmlFor={`${titlePrefix}-image`}
                            className="border-muted text-muted-foreground hover:bg-muted/50 flex h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed"
                        >
                            <ImageIcon className="size-6" />
                            <span className="text-sm">
                                {uploading
                                    ? 'Uploading...'
                                    : 'Click to upload the history image'}
                            </span>
                        </Label>
                    )}
                    <input
                        ref={imageInput}
                        id={`${titlePrefix}-image`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                    <InputError message={form.errors.image} />
                </div>

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
                            placeholder="Describe the history..."
                        />
                    </Suspense>
                    <InputError message={form.errors.description} />
                </div>
            </fieldset>

            <fieldset className="space-y-4">
                <legend className="text-foreground text-sm font-semibold">
                    Placement
                </legend>

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
            </fieldset>
        </div>
    );
}

export { HistoryFormFields };