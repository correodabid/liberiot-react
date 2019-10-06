import io from 'socket.io-client'

const dev = process.env.NODE_ENV === 'development';
export const socket = io(dev ? `http://localhost:9000` : '/').connect();