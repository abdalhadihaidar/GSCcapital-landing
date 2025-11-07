# Hostinger Deployment Guide

## Important Notes

**Hostinger Shared Hosting** typically does **NOT** support Node.js applications with custom servers. You have two options:

### Option 1: Hostinger VPS (Recommended)
- Upgrade to Hostinger VPS hosting
- Full Node.js support
- Terminal access available
- Follow steps below

### Option 2: Alternative Platforms
Consider these platforms that support Node.js:
- **Vercel** (Best for Next.js)
- **Railway**
- **Render**
- **DigitalOcean App Platform**
- **AWS/Google Cloud**

---

## Deployment Steps for Hostinger VPS/Node.js Hosting

### 1. Prerequisites
- Node.js hosting account (VPS or Node.js hosting)
- Database credentials (PostgreSQL)
- FTP/File Manager access

### 2. Build Locally (Before Upload)

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Build the application
npm run build

# Create .env file with production credentials
# DATABASE_URL="postgresql://user:password@host:5432/GSCCapital?schema=public"
```

### 3. Upload Files to Hostinger

**Files to upload:**
- `.next/` folder (build output)
- `dist/` folder (compiled server.js if using compiled version)
- `node_modules/` folder (or install on server)
- `package.json` and `package-lock.json`
- `server.ts` (or `dist/server.js` if compiled)
- `prisma/` folder
- `.env` file (with production credentials)
- `public/` folder
- `src/` folder (if not fully compiled)

**Files to exclude:**
- `.git/`
- `node_modules/.cache/`
- `.next/cache/`
- Development files

### 4. Configure Environment Variables

In Hostinger cPanel or Node.js selector, set:
- `NODE_ENV=production`
- `PORT` (provided by Hostinger)
- `HOSTNAME` (if required by Hostinger)
- `DATABASE_URL` (your PostgreSQL connection string)

### 5. Install Dependencies on Server

If you didn't upload `node_modules`:
```bash
npm install --production
npm run db:generate
```

### 6. Run Database Migrations

```bash
npm run db:migrate
```

### 7. Start the Application

Hostinger typically auto-starts based on your `package.json` start script, or you may need to configure it in the Node.js selector.

---

## Simplified Build Process (Alternative)

If compilation is complex, you can use `tsx` directly:

```json
{
  "start": "NODE_ENV=production npx tsx server.ts"
}
```

Make sure `tsx` is in dependencies, not just devDependencies.

---

## Troubleshooting

### Port Issues
- Hostinger provides PORT via environment variable
- Make sure your server.ts reads `process.env.PORT`

### Database Connection
- Verify DATABASE_URL is correct
- Check if PostgreSQL is accessible from Hostinger
- Ensure database exists: `GSCCapital`

### Build Errors
- Run `npm run db:generate` before building
- Check Node.js version compatibility
- Ensure all dependencies are installed

### Socket.IO Not Working
- WebSocket support may be limited on shared hosting
- Consider using polling transport as fallback
- Check firewall/security settings

---

## Recommended: Use Vercel Instead

For Next.js applications, **Vercel** is the best option:
1. Connect your GitHub repository
2. Automatic deployments
3. Free SSL
4. Built-in environment variables
5. Zero configuration needed

```bash
npm i -g vercel
vercel
```

