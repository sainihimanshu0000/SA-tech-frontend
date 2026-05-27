import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

function getSocketUrl() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL.replace(/\/$/, '');
  }

  try {
    const parsed = new URL(apiUrl);
    return parsed.origin;
  } catch {
    return apiUrl.replace(/\/api\/?$/, '');
  }
}

export default function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      return undefined;
    }

    const socketUrl = getSocketUrl();

    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 20000,
    });

    socketRef.current = socket;

    socket.on('connect_error', () => {
      if (import.meta.env.DEV) {
        console.warn('Socket connection failed. Check VITE_API_URL and backend CORS settings.');
      }
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return socketRef;
}