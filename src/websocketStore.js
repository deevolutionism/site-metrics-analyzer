import { writable } from 'svelte/store';

export function createWebSocketStore(url='wss://localhost:3000') {
  const { subscribe, set, update } = writable({ connected: false, data: null });

  
  // if (typeof window !== 'undefined') {
    const socket = new WebSocket(url);
    
    socket.addEventListener('open', () => {
      update(state => ({ ...state, connected: true }));
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      update(state => ({ ...state, data }));
    });

    socket.addEventListener('close', () => {
      update(state => ({ ...state, connected: false }));
    });
  // }

  function send(message) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }

  return {
    subscribe,
    send,
  };
}
