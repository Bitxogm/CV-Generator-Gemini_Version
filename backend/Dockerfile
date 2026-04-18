FROM node:20-alpine AS deps

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY backend/package.json ./backend/

RUN pnpm install --frozen-lockfile --filter backend...

FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY backend ./backend
COPY pnpm-workspace.yaml ./

WORKDIR /app/backend

RUN npx prisma generate
RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/package.json ./

EXPOSE 3000

CMD ["node", "dist/application/server.js"]
