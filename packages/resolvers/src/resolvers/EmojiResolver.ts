import { FormattingPatterns } from '../index';

export function EmojiResolver(emoji: any): any {
    if (typeof emoji === 'string') {
        const match = emoji.match(FormattingPatterns.Emoji)!;

        if (!match) {
            return emoji;
        } else {
            return { animated: !!match[0], name: match[2], id: match[3] };
        }
    } else {
        return `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`;
    }
}
