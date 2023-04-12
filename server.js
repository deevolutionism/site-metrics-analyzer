import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {WebSocket} from 'ws';
import lighthouseQueue from './lighthouseQueue.js';
import {createServer} from 'http'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(join(__dirname, '/public')));

const server = createServer(app);

const wss = new WebSocket({ noServer: true });


export const sockets = new Map();

wss.on('error', console.error);

wss.on('connection', (socket) => {
  socket.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'analyze') {
      analyze(data.url, socket);
    }
  });
});

async function analyze(url, socket) {
  const job = await lighthouseQueue.add({ url });
  const {id} = job;

  sockets.set(id, socket);
}

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
