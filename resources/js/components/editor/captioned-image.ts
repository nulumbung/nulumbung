import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        captionedImage: {
            setCaptionedImage: (options: {
                src: string;
                caption?: string;
            }) => ReturnType;
        };
    }
}

export const CaptionedImage = Node.create({
    name: 'captionedImage',

    group: 'block',

    atom: true,

    draggable: true,

    addAttributes() {
        return {
            src: { default: null },
            caption: { default: null },
        };
    },

    parseHTML() {
        return [{ tag: 'figure[data-type="captioned-image"]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'figure',
            mergeAttributes({ 'data-type': 'captioned-image' }, HTMLAttributes),
            ['img', { src: HTMLAttributes.src }],
            ['figcaption', {}, HTMLAttributes.caption || ''],
        ];
    },

    addCommands() {
        return {
            setCaptionedImage:
                (options: { src: string; caption?: string }) =>
                ({ commands }) =>
                    commands.insertContent({
                        type: this.name,
                        attrs: options,
                    }),
        };
    },
});