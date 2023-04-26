import { PermissionFlagsBits } from 'discord-api-types/v10';

export function PermissionFlagsBitsResolver(permissions: any): number | number[] {
    let res = permissions;

    if (typeof permissions === 'string') {
        res = Number(PermissionFlagsBits[permissions]) as unknown as number;
    } else if (Array.isArray(permissions)) {
        res = permissions.map((permission) =>
            typeof permission === 'string' ? Number(PermissionFlagsBits[permission]) : permission,
        ) as number[];
    }

    return res as number | number[];
}
