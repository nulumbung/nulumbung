import { iconNames, icons } from '@/components/icon-picker-icons';
import { iconDictionary } from '@/data/icon-dictionary';

const styleTokens = new Set([
    'fill',
    'outline',
    'sharp',
    'solid',
    'bold',
    'line',
    'regular',
    'light',
    'thin',
    'duotone',
    'twotone',
    'rounded',
    'filled',
    'mini',
    'flat',
    'alt',
]);

const iconTags: Record<string, string[]> = {};
for (const name of iconNames) {
    const rest = name.slice(2).replace(/\d+$/, '');
    const tags = rest
        .split(/(?=[A-Z])/)
        .map((token) => token.toLowerCase())
        .filter((token) => token.length > 1 && !styleTokens.has(token));
    iconTags[name] = [...new Set(tags)];
}

const tokenNames: Record<string, string[]> = {};
for (const [name, tags] of Object.entries(iconTags)) {
    for (const tag of tags) {
        (tokenNames[tag] ??= []).push(name);
    }
}

const langNames: Record<'id' | 'ar', Record<string, Set<string>>> = {
    id: {},
    ar: {},
};

for (const [token, entry] of Object.entries(iconDictionary)) {
    const tokens = [token, ...(entry.aliases ?? [])];
    const names = new Set<string>();
    for (const candidate of tokens) {
        for (const name of tokenNames[candidate] ?? []) {
            names.add(name);
        }
    }

    for (const lang of ['id', 'ar'] as const) {
        for (const word of entry[lang]) {
            const set = (langNames[lang][word] ??= new Set<string>());
            for (const name of names) {
                set.add(name);
            }
        }
    }
}

export { icons, iconNames };

export function searchIcons(query: string): string[] {
    const q = query.trim().toLowerCase();

    if (!q) {
        return iconNames;
    }

    const names = new Set<string>();

    for (const name of iconNames) {
        if (name.toLowerCase().includes(q)) {
            names.add(name);
        }
    }

    for (const token of Object.keys(tokenNames)) {
        if (token.includes(q)) {
            for (const name of tokenNames[token]) {
                names.add(name);
            }
        }
    }

    for (const lang of ['id', 'ar'] as const) {
        for (const [word, wordNames] of Object.entries(langNames[lang])) {
            if (word.includes(q) || q.includes(word)) {
                for (const name of wordNames) {
                    names.add(name);
                }
            }
        }
    }

    return iconNames.filter((name) => names.has(name));
}
