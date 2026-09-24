import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageIcon } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { lazy, Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PLACEMENTS, STATUS_OPTIONS, toSlug } from '@/lib/news';
import { storageUrl, uploadNewsImage } from '@/lib/upload-news-image';
import type { CategoryOption, NewsForm } from '@/lib/news';

const RichTextEditor = lazy(() =>
    import('@/components/editor/rich-text-editor').then((module) => ({
        default: module.RichTextEditor,
    })),
);

function NewsFormFields({
    form,
    categories,
    titlePrefix,
}: {
    form: NewsForm;
    categories: CategoryOption[];
    titlePrefix: 'create' | 'edit';
}) {
    const [uploading, setUploading] = useState(false);
    const [slugWasEdited, setSlugWasEdited] = useState(false);

    const handleTitleChange = (value: string) => {
        form.setData('title', value);

        if (!slugWasEdited) {
            form.setData('slug', toSlug(value));
        }
    };

    const handleImageUpload = async (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) {
            return;
        }

        setUploading(true);

        try {
            const path = await uploadNewsImage(file);
            form.setData('image', path);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <fieldset className="space-y-4">
                <legend className="text-foreground text-sm font-semibold">
                    Content
                </legend>

                <div className="grid gap-2">
                    <Label htmlFor={`${titlePrefix}-title`}>
                        News title
                    </Label>
                    <Input
                        id={`${titlePrefix}-title`}
                        value={form.data.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        autoComplete="off"
                    />
                    <InputError message={form.errors.title} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor={`${titlePrefix}-slug`}>Slug</Label>
                    <Input
                        id={`${titlePrefix}-slug`}
                        value={form.data.slug}
                        onChange={(e) => {
                            setSlugWasEdited(true);
                            form.setData('slug', e.target.value);
                        }}
                        placeholder="Filled automatically from the title"
                        autoComplete="off"
                    />
                    <InputError message={form.errors.slug} />
                </div>

                <div className="grid gap-2">
                    <Label>Main image</Label>
                    {form.data.image ? (
                        <div className="flex items-center gap-3">
                            <img
                                src={storageUrl(form.data.image)}
                                alt=""
                                className="bg-muted h-20 w-32 rounded-md object-cover"
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
                                    : 'Click to upload the main image'}
                            </span>
                        </Label>
                    )}
                    <input
                        id={`${titlePrefix}-image`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                    <InputError message={form.errors.image} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor={`${titlePrefix}-image-caption`}>
                        Main image caption
                    </Label>
                    <Input
                        id={`${titlePrefix}-image-caption`}
                        value={form.data.image_caption}
                        onChange={(e) =>
                            form.setData('image_caption', e.target.value)
                        }
                        placeholder="Describe the main image"
                        autoComplete="off"
                    />
                    <InputError message={form.errors.image_caption} />
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
                        />
                    </Suspense>
                    <InputError message={form.errors.description} />
                </div>
            </fieldset>

            <fieldset className="space-y-4">
                <legend className="text-foreground text-sm font-semibold">
                    Publication
                </legend>

                <div className="grid gap-2">
                    <Label htmlFor={`${titlePrefix}-category`}>
                        Category
                    </Label>
                    <Select
                        value={form.data.category_id}
                        onValueChange={(value) =>
                            form.setData('category_id', value)
                        }
                    >
                        <SelectTrigger
                            id={`${titlePrefix}-category`}
                            className="w-full"
                        >
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={form.errors.category_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor={`${titlePrefix}-publish-at`}>
                        Publish date
                    </Label>
                    <Input
                        id={`${titlePrefix}-publish-at`}
                        type="datetime-local"
                        value={form.data.publish_at}
                        onChange={(e) =>
                            form.setData('publish_at', e.target.value)
                        }
                    />
                    <InputError message={form.errors.publish_at} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor={`${titlePrefix}-status`}>Status</Label>
                    <Select
                        value={form.data.status}
                        onValueChange={(value) => form.setData('status', value)}
                    >
                        <SelectTrigger
                            id={`${titlePrefix}-status`}
                            className="w-full"
                        >
                            <SelectValue />
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

                <div className="grid gap-1.5">
                    <Label>Publisher</Label>
                    <p className="text-muted-foreground text-sm">
                        Filled automatically from your account role
                    </p>
                </div>
            </fieldset>

            <fieldset className="space-y-4">
                <legend className="text-foreground text-sm font-semibold">
                    Placement
                </legend>

                <div className="grid gap-3">
                    {PLACEMENTS.map((placement) => (
                        <div
                            key={placement.key}
                            className="border-border flex items-start gap-3 rounded-md border p-3"
                        >
                            <Checkbox
                                id={`${titlePrefix}-${placement.key}`}
                                checked={form.data[placement.key]}
                                onCheckedChange={(checked) =>
                                    form.setData(
                                        placement.key,
                                        checked === true,
                                    )
                                }
                            />
                            <div className="space-y-0.5">
                                <Label
                                    htmlFor={`${titlePrefix}-${placement.key}`}
                                >
                                    {placement.label}
                                </Label>
                                <p className="text-muted-foreground text-sm">
                                    {placementDescriptions[placement.key]}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </fieldset>
        </div>
    );
}

const placementDescriptions: Record<
    (typeof PLACEMENTS)[number]['key'],
    string
> = {
    is_headline: 'Highlight this article as the main headline',
    is_trending: 'Mark as a trending topic',
    is_popular: 'Mark as a popular article',
    is_latest: 'Show in the latest news section',
    is_newsletter: 'Include in the newsletter',
};

export { NewsFormFields };