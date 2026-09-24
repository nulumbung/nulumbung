import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ImageIcon, ListOrdered, Pencil } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
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
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { index } from '@/routes/management/history';
import { editFormData, wireForm } from '@/lib/history';
import type { HistoryFormData, HistoryItem } from '@/lib/history';
import '../../../../css/editor.css';

export default function HistoryShow({ history }: { history: HistoryItem }) {
    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
            <Head title={history.title} />

            <h1 className="sr-only">{history.title}</h1>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-3xl self-center rounded-xl">
                    <CardHeader className="space-y-4">
                        <div>
                            <Button variant="ghost" asChild className="w-fit gap-2">
                                <Link href={index()}>
                                    <ArrowLeft className="size-4" />
                                    Back to history
                                </Link>
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <CardTitle className="text-2xl">
                                {history.title}
                            </CardTitle>

                            <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                {history.year && (
                                    <span className="inline-flex items-center gap-1">
                                        <CalendarIcon />
                                        {history.year}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1">
                                    <ListOrdered className="size-3.5" />
                                    Order {history.sort_order}
                                </span>
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {history.image_url ? (
                            <img
                                src={history.image_url}
                                alt={history.title}
                                className="bg-muted aspect-video w-full rounded-md object-cover"
                            />
                        ) : (
                            <div className="bg-muted text-muted-foreground flex aspect-video w-full items-center justify-center rounded-md">
                                <ImageIcon className="size-8" />
                            </div>
                        )}

                        {history.description ? (
                            <div className="tiptap">
                                <div
                                    className="ProseMirror"
                                    dangerouslySetInnerHTML={{
                                        __html: history.description,
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
                                Edit history
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <EditHistoryDialog
                history={history}
                open={editOpen}
                onOpenChange={setEditOpen}
            />
        </>
    );
}

function CalendarIcon() {
    return (
        <svg
            className="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    );
}

function EditHistoryDialog({
    history,
    open,
    onOpenChange,
}: {
    history: HistoryItem;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const form = useForm<HistoryFormData>(editFormData(history));

    useEffect(() => {
        form.setData(editFormData(history));
        form.clearErrors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        wireForm(form);
        form.submit(HistoryController.update(history));
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
                    <DialogTitle>Edit history</DialogTitle>
                    <DialogDescription>
                        Update the history information
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6">
                    <HistoryFormFields form={form} titlePrefix="edit" />

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

HistoryShow.layout = ({ history }: { history: HistoryItem }) => ({
    breadcrumbs: [
        {
            title: 'History',
            href: index(),
        },
        {
            title: history.title,
            href: history.id,
        },
    ],
});