# @paqujs/ws

WS module for Paqu.js

## Installation

Node.js 16.x or higher is required.

```bash
npm install @paqujs/ws
yarn add @paqujs/ws
pnpm add @paqujs/ws
```

## Usage

```ts
import { WebSocketManager } from '@paqujs/ws';

const ws = new WebSocketManager({ intents: ['Guilds'] });

ws.on('ready', (user) => {
    console.log(`Logged in as ${user.username}#${user.discriminator}`);
});

ws.connect('your-super-secret-token');
```

## Links

- [Website](https://paqujs.github.io/)
- [Documentation](https://paqujs.github.io/packages/ws)
- [GitHub](https://github.com/paqujs/paqujs/tree/main/packages/ws)
- [NPM](https://www.npmjs.com/package/@paqujs/ws)
- [Discord](https://discord.gg/fJva3Scm5G)
