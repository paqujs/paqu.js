import { DataResolver, ColorResolver } from '../index';
import { MessageFlagsBitField } from '@paqujs/bitfields';

export async function MessageDataResolver(message: any) {
    let res = message;
    let files: any[];

    if (typeof res === 'string') {
        res = {
            content: res,
        };
    }

    if (res.files) {
        files = await Promise.all(
            res.files.map((file) =>
                typeof file === 'object' ? file : DataResolver.resolveFile(file),
            ),
        );

        delete res.files;
    }

    if (res.embeds) {
        for (const embed of res.embeds) {
            embed.color &&= ColorResolver(embed.color);
        }
    }

    if ('flags' in res) {
        res.flags = new MessageFlagsBitField().set(res.flags!);
    }

    if (res.attachments) {
        res.attachments = res.attachments.map((attachment) => {
            return {
                filename: attachment.filename,
                description: attachment.description,
            };
        });
    }

    return {
        body: res,
        files,
    };
}
