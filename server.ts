// server.ts - Next.js Standalone + Socket.IO
import { setupSocket } from '@/lib/socket';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
// Render and other platforms provide PORT via environment variable
// Default to 3000 for local dev, but always use PORT if available
const currentPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
// Always bind to 0.0.0.0 to accept connections from outside the container
const hostname = '0.0.0.0';

// Custom server with Socket.IO integration
async function createCustomServer() {
  try {
    // Create Next.js app
    const nextApp = next({ 
      dev,
      dir: process.cwd(),
      // In production, use the current directory where .next is located
      conf: dev ? undefined : { distDir: './.next' }
    });

    await nextApp.prepare();
    console.log('> Next.js app prepared successfully');
    const handle = nextApp.getRequestHandler();

    // Create HTTP server that will handle both Next.js and Socket.IO
    const server = createServer((req, res) => {
      // Skip socket.io requests from Next.js handler
      if (req.url?.startsWith('/api/socketio')) {
        return;
      }
      // Log requests for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
      }
      handle(req, res);
    });

    // Setup Socket.IO
    const io = new Server(server, {
      path: '/api/socketio',
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    setupSocket(io);

    // Start the server
    // Use callback to ensure server is actually listening before logging
    server.listen(currentPort, hostname, () => {
      const address = server.address();
      const actualPort = typeof address === 'object' && address ? address.port : currentPort;
      console.log(`> Server listening on port ${actualPort}`);
      console.log(`> Ready on http://${hostname}:${actualPort}`);
      console.log(`> Socket.IO server running at ws://${hostname}:${actualPort}/api/socketio`);
    });
    
    // Handle errors
    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${currentPort} is already in use`);
        process.exit(1);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(() => {
        console.log('HTTP server closed');
      });

      io.close(() => {
        console.log('Socket.IO server closed');
      });

      // Disconnect Prisma
      try {
        const { db } = await import('@/lib/db');
        await db.$disconnect();
        console.log('Database connections closed');
      } catch (err) {
        console.error('Error disconnecting database:', err);
      }

      process.exit(0);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (err) {
    console.error('Server startup error:', err);
    if (err instanceof Error) {
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
    }
    process.exit(1);
  }
}

// Start the server
createCustomServer();
