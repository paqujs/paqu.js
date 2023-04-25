# @paqujs/collection

Collection module for paqu.js.

## Installation

Node.js 16.x or higher is required.

```bash
npm install @paqujs/collection
yarn add @paqujs/collection
pnpm add @paqujs/collection
```

## Usage

```ts
import { Collection } from '@paqujs/collection';

const collection = new Collection<string, number>();

collection.set('foo', 1);
collection.set('bar', 2);

console.log(collection.get('foo')); // 1
console.log(collection.get('bar')); // 2
```

## Links

- [Website](https://paqujs.github.io/)
- [Documentation](https://paqujs.github.io/packages/collection)
- [GitHub](https://github.com/paqujs/paqujs/tree/main/packages/collection)
- [NPM](https://www.npmjs.com/package/@paqujs/collection)
- [Discord](https://discord.gg/fJva3Scm5G)
