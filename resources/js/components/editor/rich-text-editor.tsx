import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import {
    EditorContent,
    useEditor,
    useEditorState,
    type Editor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Heading1,
    Heading2,
    Heading3,
    ImagePlus,
    Italic,
    Link2,
    List,
    ListOrdered,
    Minus,
    Quote,
    Redo2,
    Strikethrough,
    Undo2,
    Upload,
} from 'lucide-react';
import type { ChangeEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { storageUrl, uploadNewsImage } from '@/lib/upload-news-image';
import { toast } from 'sonner';
import { CaptionedImage } from './captioned-image';
import '../../../css/editor.css';

function ToolbarButton({
    icon,
    label,
    active,
    disabled,
    onClick,
}: {
    icon: ReactNode;
    label: string;
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
}) {
    return (
        <Button
            type="button"
            variant={active ? 'secondary' : 'ghost'}
            size="icon"
            className={cn(
                'size-8',
                active && 'bg-accent text-accent-foreground',
            )}
            title={label}
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
        >
            {icon}
        </Button>
    );
}

function Toolbar({
    editor,
    onSelectImage,
    onEditCaptioned,
    captionedActive,
}: {
    editor: Editor;
    onSelectImage: () => void;
    onEditCaptioned: () => void;
    captionedActive: boolean;
}) {
    const states = useEditorState({
        editor,
        selector: ({ editor }) => ({
            bold: editor.isActive('bold'),
            italic: editor.isActive('italic'),
            underline: editor.isActive('underline'),
            strike: editor.isActive('strike'),
            code: editor.isActive('code'),
            link: editor.isActive('link'),
            heading1: editor.isActive('heading', { level: 1 }),
            heading2: editor.isActive('heading', { level: 2 }),
            heading3: editor.isActive('heading', { level: 3 }),
            bulletList: editor.isActive('bulletList'),
            orderedList: editor.isActive('orderedList'),
            blockquote: editor.isActive('blockquote'),
            alignLeft: editor.isActive({ textAlign: 'left' }),
            alignCenter: editor.isActive({ textAlign: 'center' }),
            alignRight: editor.isActive({ textAlign: 'right' }),
            alignJustify: editor.isActive({ textAlign: 'justify' }),
        }),
    });

    const setLink = () => {
        const previous = editor.getAttributes('link').href as
            | string
            | undefined;
        const url = window.prompt('Link URL', previous ?? 'https://');

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
    };

    return (
        <div className="border-border bg-muted/40 flex flex-wrap items-center gap-0.5 border-b p-1.5">
            <ToolbarButton
                icon={<Bold className="size-4" />}
                label="Bold"
                active={states.bold}
                onClick={() => editor.chain().focus().toggleBold().run()}
            />
            <ToolbarButton
                icon={<Italic className="size-4" />}
                label="Italic"
                active={states.italic}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            />
            <ToolbarButton
                icon={<UnderlineIcon className="size-4" />}
                label="Underline"
                active={states.underline}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            />
            <ToolbarButton
                icon={<Strikethrough className="size-4" />}
                label="Strikethrough"
                active={states.strike}
                onClick={() => editor.chain().focus().toggleStrike().run()}
            />
            <ToolbarButton
                icon={<Code className="size-4" />}
                label="Inline code"
                active={states.code}
                onClick={() => editor.chain().focus().toggleCode().run()}
            />
            <ToolbarButton
                icon={<Link2 className="size-4" />}
                label="Link"
                active={states.link}
                onClick={setLink}
            />

            <span className="bg-border mx-1 h-5 w-px" />

            <ToolbarButton
                icon={<Heading1 className="size-4" />}
                label="Heading 1"
                active={states.heading1}
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
            />
            <ToolbarButton
                icon={<Heading2 className="size-4" />}
                label="Heading 2"
                active={states.heading2}
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
            />
            <ToolbarButton
                icon={<Heading3 className="size-4" />}
                label="Heading 3"
                active={states.heading3}
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
            />
            <ToolbarButton
                icon={<List className="size-4" />}
                label="Bullet list"
                active={states.bulletList}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
            <ToolbarButton
                icon={<ListOrdered className="size-4" />}
                label="Ordered list"
                active={states.orderedList}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />
            <ToolbarButton
                icon={<Quote className="size-4" />}
                label="Blockquote"
                active={states.blockquote}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
            />
            <ToolbarButton
                icon={<Minus className="size-4" />}
                label="Horizontal rule"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
            />

            <span className="bg-border mx-1 h-5 w-px" />

            <ToolbarButton
                icon={<AlignLeft className="size-4" />}
                label="Align left"
                active={states.alignLeft}
                onClick={() =>
                    editor.chain().focus().setTextAlign('left').run()
                }
            />
            <ToolbarButton
                icon={<AlignCenter className="size-4" />}
                label="Align center"
                active={states.alignCenter}
                onClick={() =>
                    editor.chain().focus().setTextAlign('center').run()
                }
            />
            <ToolbarButton
                icon={<AlignRight className="size-4" />}
                label="Align right"
                active={states.alignRight}
                onClick={() =>
                    editor.chain().focus().setTextAlign('right').run()
                }
            />
            <ToolbarButton
                icon={<AlignJustify className="size-4" />}
                label="Justify"
                active={states.alignJustify}
                onClick={() =>
                    editor.chain().focus().setTextAlign('justify').run()
                }
            />

            <span className="bg-border mx-1 h-5 w-px" />

            <ToolbarButton
                icon={<ImagePlus className="size-4" />}
                label="Insert image"
                onClick={onSelectImage}
            />
            {captionedActive && (
                <ToolbarButton
                    icon={<Upload className="size-4" />}
                    label="Edit image caption"
                    active
                    onClick={onEditCaptioned}
                />
            )}

            <span className="bg-border mx-1 h-5 w-px" />

            <ToolbarButton
                icon={<Undo2 className="size-4" />}
                label="Undo"
                disabled={!editor.can().chain().focus().undo().run()}
                onClick={() => editor.chain().focus().undo().run()}
            />
            <ToolbarButton
                icon={<Redo2 className="size-4" />}
                label="Redo"
                disabled={!editor.can().chain().focus().redo().run()}
                onClick={() => editor.chain().focus().redo().run()}
            />
        </div>
    );
}

function UnderlineIcon({ className }: { className?: string }) {
    return <span className={cn('underline', className)}>U</span>;
}

function sanitizeHtml(html: string, removeEmptyParagraphs: boolean): string {
    if (typeof window === 'undefined') {
        return html;
    }

    const parsed = new DOMParser().parseFromString(html, 'text/html');

    parsed.body.querySelectorAll<HTMLElement>('*').forEach((element) => {
        element.removeAttribute('style');
        element.removeAttribute('class');
        element.removeAttribute('width');
        element.removeAttribute('height');
        element.removeAttribute('align');
    });

    if (removeEmptyParagraphs) {
        parsed.body.querySelectorAll('p').forEach((paragraph) => {
            const hasContent =
                (paragraph.textContent ?? '').trim() !== '' ||
                paragraph.querySelector('img, figure') !== null;

            if (!hasContent) {
                paragraph.remove();
            }
        });
    }

    return parsed.body.innerHTML.trim();
}

function stripPastedFormatting(html: string): string {
    return sanitizeHtml(html, true);
}

function toEditorHtml(value: string): string {
    if (!value) {
        return '';
    }

    if (/<[a-z][\s\S]*>/i.test(value)) {
        return sanitizeHtml(value, false);
    }

    return value
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter((block) => block !== '')
        .map(
            (block) =>
                `<p>${block
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/\n/g, '<br>')}</p>`,
        )
        .join('');
}

export function RichTextEditor({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    const [captionDialog, setCaptionDialog] = useState<{
        src: string;
        caption: string;
        editing: boolean;
    } | null>(null);
    const imageInput = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                link: {
                    openOnClick: false,
                    autolink: true,
                    linkOnPaste: true,
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Image.configure({
                inline: false,
                allowBase64: false,
            }),
            Placeholder.configure({
                placeholder: placeholder ?? 'Write the news content...',
            }),
            CaptionedImage,
        ],
        editorProps: {
            transformPastedHTML: (html) => stripPastedFormatting(html),
        },
        content: toEditorHtml(value),
        immediatelyRender: false,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    });

    useEffect(() => {
        if (!editor) {
            return;
        }

        const next = toEditorHtml(value);

        if (editor.getHTML() === next) {
            return;
        }

        editor.commands.setContent(next, { emitUpdate: false });
    }, [editor, value]);

    const captionedState = useEditorState({
        editor,
        selector: ({ editor }) => {
            if (!editor || !editor.isActive('captionedImage')) {
                return { active: false, src: '', caption: '' };
            }

            const { src, caption } = editor.getAttributes('captionedImage') as {
                src?: string;
                caption?: string;
            };

            return {
                active: true,
                src: src ?? '',
                caption: caption ?? '',
            };
        },
    }) ?? { active: false, src: '', caption: '' };

    if (!editor) {
        return null;
    }

    const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) {
            toast.error('Image upload failed');
            return;
        }

        try {
            const path = await uploadNewsImage(file);

            setCaptionDialog({
                src: storageUrl(path),
                caption: '',
                editing: false,
            });
        } catch {
            toast.error('Image upload failed');
        }
    };

    const confirmCaption = () => {
        if (!captionDialog) {
            return;
        }

        if (captionDialog.editing) {
            editor
                .chain()
                .focus()
                .updateAttributes('captionedImage', {
                    caption: captionDialog.caption,
                })
                .run();
        } else {
            editor
                .chain()
                .focus()
                .setCaptionedImage({
                    src: captionDialog.src,
                    caption: captionDialog.caption,
                })
                .createParagraphNear()
                .run();
        }

        setCaptionDialog(null);
    };

    const editCaptioned = () => {
        if (captionedState.active) {
            setCaptionDialog({
                src: captionedState.src,
                caption: captionedState.caption,
                editing: true,
            });
        }
    };

    return (
        <div className="flex flex-col overflow-hidden rounded-md border">
            <input
                ref={imageInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
            />

            <Toolbar
                editor={editor}
                onSelectImage={() => imageInput.current?.click()}
                onEditCaptioned={editCaptioned}
                captionedActive={captionedState.active}
            />

            <Dialog
                open={captionDialog !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setCaptionDialog(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {captionDialog?.editing
                                ? 'Edit image caption'
                                : 'Image caption'}
                        </DialogTitle>
                        <DialogDescription>
                            {captionDialog?.editing
                                ? 'Update the caption of this image'
                                : 'Add a caption to this image'}
                        </DialogDescription>
                    </DialogHeader>

                    {captionDialog && (
                        <div className="space-y-4">
                            <img
                                src={captionDialog.src}
                                alt=""
                                className="bg-muted max-h-40 w-full rounded-md object-contain"
                            />
                            <div className="space-y-2">
                                <Label htmlFor="image-caption-input">
                                    Image caption
                                </Label>
                                <Input
                                    id="image-caption-input"
                                    value={captionDialog.caption}
                                    onChange={(event) =>
                                        setCaptionDialog({
                                            ...captionDialog,
                                            caption: event.target.value,
                                        })
                                    }
                                    placeholder="Image caption"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="button" onClick={confirmCaption}>
                            {captionDialog?.editing ? 'Save' : 'Insert'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <EditorContent editor={editor} className="tiptap" />
        </div>
    );
}