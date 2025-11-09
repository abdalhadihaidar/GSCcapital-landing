import { PrismaClient } from '@prisma/client'

// Use a global variable to store the Prisma client instance
// This prevents creating multiple instances in Next.js production builds
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a single PrismaClient instance and reuse it
// This is critical to prevent "too many connections" errors
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

// Store the instance globally to prevent multiple connections
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = db
}

// Gracefully disconnect on process termination
if (typeof process !== 'undefined') {
  const disconnect = async () => {
    try {
      await db.$disconnect()
    } catch (error) {
      console.error('Error disconnecting Prisma:', error)
    }
  }

  process.on('beforeExit', disconnect)
  process.on('SIGINT', async () => {
    await disconnect()
    process.exit(0)
  })
  process.on('SIGTERM', async () => {
    await disconnect()
    process.exit(0)
  })
}