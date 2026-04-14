FROM node:20-alpine AS deps

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile
RUN pnpm prisma generate

FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

RUN if [ ! -f .env ]; then cp .env.example .env 2>/dev/null || true; fi

EXPOSE 3000

CMD ["node", "dist/application/server.js"]