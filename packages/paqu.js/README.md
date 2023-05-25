# paqu.js

paqu.js is an easy-to-use [Node.js](https://nodejs.org/) library for interacting with the [Discord API](https://discord.com/developers/docs/)'s.

## Installation

Node.js 16.x or higher is required.

```bash
npm install paqu.js
yarn add paqu.js
pnpm add paqu.js
```

### Features

-   Easy to use
-   Object-oriented
-   Lightweight
-   Fast
-   TypeScript support
-   100% coverage of the Discord API

### Optional Dependencies

-   [zlib-sync](https://www.npmjs.com/package/zlib-sync) for faster WebSocket data (de)compression
-   [erlpack](https://www.npmjs.com/package/erlpack) for faster WebSocket data (de)serialisation

## Usage

```ts
import { Client } from 'paqu.js';

const client = new Client({
    ws: {
        intents: ['Guilds', 'GuildMessages', 'MessageContent']
    }
});

client.ws.on('ready', () => {
    console.log(`Logged in as ${client.user.username}!`);
});

client.ws.on('messageCreate', (message) => {
    if (message.content === '!ping') {
        message.reply({
            content: `Pong! :ping_pong: **${client.ws.ping}ms**`,
        });
    }
});

client.ws.connect('your-super-secret-token');
```

## Links

- [Website](https://paqujs.github.io/)
- [Documentation](https://paqujs.github.io/packages/sharding)
- [GitHub](https://github.com/paqujs/paqujs/tree/main/packages/sharding)
- [NPM](https://www.npmjs.com/package/@paqujs/sharding)
- [Discord](https://discord.gg/fJva3Scm5G)
