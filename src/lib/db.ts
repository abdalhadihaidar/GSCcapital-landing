// IMPORTANT: Set DATABASE_URL before importing PrismaClient
// Prisma reads DATABASE_URL from env() when the schema is loaded
// This must happen before any Prisma imports

// Get the appropriate database URL based on environment
// Supports multiple formats:
// 1. POSTGRESQL_ADDON_URI (Clever Cloud format) - highest priority in production
// 2. DATABASE_URL_PRODUCTION (custom production URL)
// 3. DATABASE_URL (default, used for local development)

if (process.env.NODE_ENV === 'production') {
  // In production, try multiple sources in order of priority:
  // 1. POSTGRESQL_ADDON_URI (Clever Cloud) - highest priority
  // 2. DATABASE_URL_PRODUCTION (custom)
  // 3. DATABASE_URL (fallback)
  const productionUrl =
    process.env.POSTGRESQL_ADDON_URI ||
    process.env.DATABASE_URL_PRODUCTION ||
    process.env.DATABASE_URL
  
  if (productionUrl) {
    process.env.DATABASE_URL = productionUrl
  } else {
    console.warn('⚠️  DATABASE_URL is not set. Please configure your database connection.')
    console.warn('   For production: Set POSTGRESQL_ADDON_URI, DATABASE_URL_PRODUCTION, or DATABASE_URL')
  }
} else {
  // In development, use DATABASE_URL (should be set in .env.local)
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL is not set. Please configure your database connection.')
    console.warn('   For local: Set DATABASE_URL in .env.local')
  }
}

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db