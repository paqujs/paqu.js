# @paqujs/builders

Builders module for paqu.js.

## Installation

Node.js 16.x or higher is required.

```bash
npm install @paqujs/builders
yarn add @paqujs/builders
pnpm add @paqujs/builders
```

## Usage

```ts
import { EmbedBuilder } from '@paqujs/builders';

const embed = new EmbedBuilder()
    .setTitle('Hello, world!')
    .setDescription('This is an embed!')
    .setColor('#0099ff');

console.log(embed.toJSON());
```

## Links

-   [Website](https://paqujs.github.io/)
-   [Documentation](https://paqujs.github.io/packages/builders)
-   [GitHub](https://github.com/paqujs/paqujs/tree/main/packages/builders)
-   [NPM](https://www.npmjs.com/package/@paqujs/builders)
-   [Discord](https://discord.gg/fJva3Scm5G)
