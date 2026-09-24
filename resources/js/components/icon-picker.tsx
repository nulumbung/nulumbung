import { Search } from 'lucide-react';
import { useState } from 'react';
import { CategoryIcon } from '@/components/category-icon';
import { icons } from '@/components/icon-picker-icons';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { searchIcons } from '@/lib/icon-search';
import { cn } from '@/lib/utils';

export function IconPicker({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    const filtered = searchIcons(query);

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
                if (!open) {
                    setQuery('');
                }
            }}
        >
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="justify-start gap-2"
                >
                    <CategoryIcon name={value} />
                    {value || 'Pick an icon'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Pick an icon</DialogTitle>
                    <DialogDescription>
                        Choose an icon for this category
                    </DialogDescription>
                </DialogHeader>

                <div className="relative">
                    <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search icons..."
                        className="pl-9"
                        autoComplete="off"
                    />
                </div>

                {query && (
                    <p className="text-muted-foreground text-xs">
                        Showing {filtered.length} icons
                    </p>
                )}

                <div className="flex h-72 flex-col overflow-hidden rounded-md border">
                    <div className="flex-1 overflow-y-auto p-2">
                        {filtered.length === 0 ? (
                            <p className="text-muted-foreground py-8 text-center text-sm">
                                No icons found
                            </p>
                        ) : (
                            <div className="grid grid-cols-8 gap-1">
                                {filtered.map((name) => {
                                    const Icon = icons[name];

                                    return (
                                        <button
                                            key={name}
                                            type="button"
                                            className={cn(
                                                'hover:bg-muted flex size-9 items-center justify-center rounded-md',
                                                value === name &&
                                                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                                            )}
                                            title={name}
                                            onClick={() => {
                                                onChange(name);
                                                setOpen(false);
                                                setQuery('');
                                            }}
                                        >
                                            <Icon className="size-4" />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={!value}
                        onClick={() => {
                            onChange('');
                            setOpen(false);
                            setQuery('');
                        }}
                    >
                        Remove icon
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}