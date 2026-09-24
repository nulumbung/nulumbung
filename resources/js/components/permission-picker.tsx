import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export type PermissionOption = {
    value: string;
    label: string;
    group: string;
};

export function PermissionPicker({
    permissions,
    selected,
    onChange,
}: {
    permissions: PermissionOption[];
    selected: string[];
    onChange: (selected: string[]) => void;
}) {
    const groups = permissions.reduce<Record<string, PermissionOption[]>>(
        (accumulator, permission) => {
            accumulator[permission.group] ??= [];
            accumulator[permission.group].push(permission);

            return accumulator;
        },
        {},
    );

    return (
        <div className="space-y-4">
            {Object.entries(groups).map(([group, items]) => {
                const groupValues = items.map((item) => item.value);
                const allSelected = groupValues.every((value) =>
                    selected.includes(value),
                );

                const toggleGroup = (checked: boolean | 'indeterminate') => {
                    onChange(
                        checked
                            ? Array.from(
                                  new Set([...selected, ...groupValues]),
                              )
                            : selected.filter(
                                  (value) => !groupValues.includes(value),
                              ),
                    );
                };

                return (
                    <div key={group} className="rounded-md border p-3">
                        <div className="flex items-center justify-between gap-2">
                            <Label
                                htmlFor={`permission-group-${group}`}
                                className="text-sm font-semibold"
                            >
                                {group}
                            </Label>
                            <Checkbox
                                id={`permission-group-${group}`}
                                checked={allSelected}
                                onCheckedChange={toggleGroup}
                                aria-label={`Toggle all ${group} permissions`}
                            />
                        </div>

                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            {items.map((item) => (
                                <Label
                                    key={item.value}
                                    htmlFor={`permission-${item.value}`}
                                    className="flex items-center gap-2 text-sm font-normal"
                                >
                                    <Checkbox
                                        id={`permission-${item.value}`}
                                        checked={selected.includes(item.value)}
                                        onCheckedChange={(checked) =>
                                            onChange(
                                                checked
                                                    ? [...selected, item.value]
                                                    : selected.filter(
                                                          (value) =>
                                                              value !==
                                                              item.value,
                                                      ),
                                            )
                                        }
                                    />
                                    {item.label}
                                </Label>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
