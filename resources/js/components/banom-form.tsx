import { ImageIcon } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { lazy, Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { storageUrl, uploadBanomImage } from '@/lib/upload-banom-image';
import type { BanomForm } from '@/lib/banom';
import { toast } from 'sonner';

const RichTextEditor = lazy(() =>
    import('@/components/editor/rich-text-editor').then((module) => ({
        default: module.RichTextEditor,
    })),
);

export function BanomFormFields({
    form,
    titlePrefix,
}: {
    form: BanomForm;
    titlePrefix: 'create' | 'edit';
}) {
    const [uploading, setUploading] = useState(false);

    const handleLogoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) {
            return;
        }

        setUploading(true);

        try {
            const path = await uploadBanomImage(file);
            form.setData('logo', path);
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
                    Banom information
                </legend>

                <div className="grid gap-2">
                    <Label htmlFor={`${titlePrefix}-name`}>Banom name</Label>
                    <Input
                        id={`${titlePrefix}-name`}
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        autoComplete="off"
                    />
                    <InputError message={form.errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor={`${titlePrefix}-tagline`}>Tagline</Label>
                    <Input
                        id={`${titlePrefix}-tagline`}
                        value={form.data.tagline}
                        onChange={(e) => form.setData('tagline', e.target.value)}
                        autoComplete="off"
                    />
                    <InputError message={form.errors.tagline} />
                </div>

                <div className="grid gap-2">
                    <Label>Banom logo</Label>
                    {form.data.logo ? (
                        <div className="flex items-center gap-3">
                            <img
                                src={storageUrl(form.data.logo)}
                                alt=""
                                className="bg-muted size-20 rounded-full object-cover"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => form.setData('logo', '')}
                            >
                                Remove image
                            </Button>
                        </div>
                    ) : (
                        <Label
                            htmlFor={`${titlePrefix}-logo`}
                            className="border-muted text-muted-foreground hover:bg-muted/50 flex h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed"
                        >
                            <ImageIcon className="size-6" />
                            <span className="text-sm">
                                {uploading
                                    ? 'Uploading...'
                                    : 'Click to upload the banom logo'}
                            </span>
                        </Label>
                    )}
                    <input
                        id={`${titlePrefix}-logo`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                    />
                    <InputError message={form.errors.logo} />
                </div>

                <div className="grid gap-2">
                    <Label>Description</Label>
                    <Suspense fallback={<Skeleton className="h-64 w-full rounded-md" />}>
                        <RichTextEditor
                            value={form.data.description}
                            onChange={(html) => form.setData('description', html)}
                            placeholder="Describe the banom..."
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
                    <Label htmlFor={`${titlePrefix}-sort-order`}>Order</Label>
                    <Input
                        id={`${titlePrefix}-sort-order`}
                        type="number"
                        min={0}
                        value={form.data.sort_order}
                        onChange={(e) => form.setData('sort_order', e.target.value)}
                        placeholder="Position in the list"
                    />
                    <InputError message={form.errors.sort_order} />
                </div>
            </fieldset>
        </div>
    );
}