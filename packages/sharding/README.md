# @paqujs/sharding

Cluster manager for paqu.js.

## Installation

Node.js 16.x or higher is required.

```bash
npm install @paqujs/sharding
yarn add @paqujs/sharding
pnpm add @paqujs/sharding
```

## Usage

```ts
import { ClusterManager } from '@paqujs/sharding';

const manager = new ClusterManager({
    file: 'index.js',
    token: 'your-super-secret-token',
});

manager.spawn();

manager.on('clusterReady', (cluster) => {
    console.log(`Cluster ${cluster.id} is ready!`);
});

manager.on('allReady', (clusters) => {
    console.log(`All (${clusters.size}) clusters are ready!`);
});
```

## Links

-   [Website](https://paqujs.github.io/)
-   [Documentation](https://paqujs.github.io/packages/sharding)
-   [GitHub](https://github.com/paqujs/paqujs/tree/main/packages/sharding)
-   [NPM](https://www.npmjs.com/package/@paqujs/sharding)
-   [Discord](https://discord.gg/fJva3Scm5G)
