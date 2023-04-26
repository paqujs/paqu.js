import { WebSocketManager } from '../dist/index.js';

const ws = new WebSocketManager({
    intents: ['Guilds'],
    presence: {
        status: 'dnd',
    },
});

ws.on('ready', () => {
    console.log('Ready!');

    console.log(ws.rest.options);
});

ws.connect('MTA5NjA5MTI0NjQ0MDc2MzQ5Mw.GKCrk_.S96CqpKe21RZJI2h0kKgHNmbK7hBCNgInqY5OY');
