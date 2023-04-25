export enum Colors {
    Default = 0x000000,
    White = 0xffffff,
    Aqua = 0x1abc9c,
    Green = 0x2ecc71,
    Blue = 0x3498db,
    Yellow = 0xfee75c,
    Purple = 0x9b59b6,
    LuminousVividPink = 0xe91e63,
    Fuchsia = 0xeb459e,
    Gold = 0xf1c40f,
    Orange = 0xe67e22,
    Red = 0xe74c3c,
    Grey = 0x95a5a6,
    Navy = 0x34495e,
    DarkAqua = 0x11806a,
    DarkGreen = 0x1f8b4c,
    DarkBlue = 0x206694,
    DarkPurple = 0x71368a,
    DarkVividPink = 0xad1457,
    DarkGold = 0xc27c0e,
    DarkOrange = 0xa84300,
    DarkRed = 0x992d22,
    DarkGrey = 0x979c9f,
    DarkerGrey = 0x2c2f33,
    DarkNavy = 0x2c3e50,
    LightAqua = 0x00b8d4,
    LightGreen = 0x2f6e4f,
    LightBlue = 0x00abd4,
    LightPurple = 0x72418f,
    LightVividPink = 0xf984ef,
    LightGold = 0xffcb00,
    LightOrange = 0xf09819,
    LightRed = 0xe55b3c,
    LightGrey = 0xbcc0c0,
    LightNavy = 0x3a5fcd,
    Random = Math.floor(Math.random() * (0xffffff + 1)),
}

export interface RGBResolvable {
    r: number;
    g: number;
    b: number;
}

export type ColorResolvable = RGBResolvable | number | `#${string}` | keyof typeof Colors;

export function ColorResolver(color: ColorResolvable): number {
    let res = color;

    if (typeof color === 'string') {
        if (color.startsWith('#')) {
            res = HexToHexDecimal(color as `#${string}`);
        } else {
            res = Colors[color as keyof typeof Colors];
        }
    } else if (IsRGB(color)) {
        res = RGBToHex(color);
        res = HexToHexDecimal(res);
    }

    return res as number;
}

export function IsRGB(rgb: any): rgb is RGBResolvable {
    return typeof rgb === 'object' && 'r' in rgb && 'g' in rgb && 'b' in rgb;
}

export function RGBToHex({ r, g, b }: RGBResolvable): `#${string}` {
    return `#${[r, g, b]
        .map((component) => {
            const hex = component.toString(16);
            return hex.length === 1 ? `0${hex}` : hex;
        })
        .join('')}`;
}

export function HexToHexDecimal(color: `#${string}`) {
    return parseInt(color.replace(/^#/g, ''), 16);
}

export function HexDecimalToHex(color: number) {
    return `#${color.toString(16).padStart(6, '0')}`;
}
