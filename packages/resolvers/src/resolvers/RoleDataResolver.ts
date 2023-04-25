import { ColorResolver } from '../index';
import { PermissionFlagsBitField } from '@paqujs/bitfields';

export function RoleDataResolver(role: any) {
    const res = role;

    if (typeof res.permissions !== 'number') {
        res.permissions = new PermissionFlagsBitField().set(res.permissions);
    }

    if (res.color) {
        res.color = ColorResolver(res.color);
    }

    return res;
}
