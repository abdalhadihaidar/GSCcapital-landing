import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Get the appropriate database URL based on environment
// In production, prefer DATABASE_URL_PRODUCTION if available, otherwise use DATABASE_URL
// In development, use DATABASE_URL (local database)
const getDatabaseUrl = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.DATABASE_URL_PRODUCTION || process.env.DATABASE_URL || ''
  }
  return process.env.DATABASE_URL || ''
}

const databaseUrl = getDatabaseUrl()

if (!databaseUrl) {
  console.warn('⚠️  DATABASE_URL is not set. Please configure your database connection.')
  console.warn('   For local: Set DATABASE_URL in .env.local')
  console.warn('   For production: Set DATABASE_URL_PRODUCTION or DATABASE_URL')
}

// Override DATABASE_URL for Prisma if DATABASE_URL_PRODUCTION is set in production
if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL_PRODUCTION) {
  process.env.DATABASE_URL = process.env.DATABASE_URL_PRODUCTION
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db