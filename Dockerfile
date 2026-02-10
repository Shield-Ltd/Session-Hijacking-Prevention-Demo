# Stage 1: Install dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Neon requires a specific URI format to pass validation
ENV DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
ENV JWT_SECRET="placeholder_secret_for_build"
ENV UPSTASH_REDIS_REST_URL="https://placeholder-redis.upstash.io"
ENV UPSTASH_REDIS_REST_TOKEN="placeholder_token"
ENV EMAIL_ID="placeholder@example.com"
ENV EMAIL_APP_PASSWORD="placeholder_password"

RUN npm run build

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]