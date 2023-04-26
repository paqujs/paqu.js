import { EmbedBuilder } from '../dist/index.js';

const embed = new EmbedBuilder()
    .setTitle('Hello, world!')
    .setDescription('This is an embed!')
    .setColor('#0099ff');

console.log(EmbedBuilder.from(embed.toJSON()));
