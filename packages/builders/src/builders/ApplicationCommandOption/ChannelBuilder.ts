import {
    type APIApplicationCommandChannelOption,
    ApplicationCommandOptionType,
    ChannelType,
} from 'discord-api-types/v10';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export type GuildBasedChannelTypes =
    | ChannelType.GuildText
    | ChannelType.GuildVoice
    | ChannelType.GuildCategory
    | ChannelType.GuildAnnouncement
    | ChannelType.GuildStageVoice
    | ChannelType.GuildDirectory
    | ChannelType.GuildForum
    | ChannelType.AnnouncementThread
    | ChannelType.PublicThread
    | ChannelType.PrivateThread;

export type GuildBasedChannelTypesResolvable = keyof typeof ChannelType | GuildBasedChannelTypes;

export class ApplicationCommandChannelOptionBuilder extends ApplicationCommandBaseOptionBuilder<APIApplicationCommandChannelOption> {
    public channel_types: GuildBasedChannelTypes[];

    public constructor(data?: Omit<APIApplicationCommandChannelOption, 'type'>) {
        super({ ...data, type: ApplicationCommandOptionType.Channel });

        this.channel_types = data?.channel_types ?? [];
    }

    public setChannelTypes(types: GuildBasedChannelTypesResolvable[]) {
        const resolved = [];

        for (const type of types) {
            if (typeof type === 'string') resolved.push(ChannelType[type]);
            else resolved.push(type);
        }

        return this.set('channel_types', resolved);
    }

    public static from(data: Omit<APIApplicationCommandChannelOption, 'type'>) {
        return new ApplicationCommandChannelOptionBuilder(data);
    }
}
