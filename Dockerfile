# Multi-stage production build for TrustNest
FROM node:24-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
RUN npm ci

# Copy full source
COPY . .

# Run data validation & build frontend production bundle
RUN npm run validate:data
RUN npm run build

# Stage 2: Production runner
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm install -g tsx

# Copy built frontend assets and server codebase
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/src ./src
COPY --from=builder /app/data ./data
COPY --from=builder /app/uploads ./uploads
COPY --from=builder /app/.env.example ./.env

EXPOSE 4000

# Health check probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/v1/health || exit 1

CMD ["tsx", "server/src/index.ts"]
