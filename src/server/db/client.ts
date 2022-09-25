// src/server/db/client.ts
import { Prisma, PrismaClient } from "@prisma/client";
import { env } from "../../env/server.mjs";
import Redis from "ioredis";
import { createPrismaRedisCache } from "prisma-redis-middleware";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Redis Middleware stuff
const redis = new Redis(env.REDIS_URL);
const cacheMiddleware = createPrismaRedisCache({
  storage: {
    type: "redis",
    options: {
      client: redis,
      invalidation: { referencesTTL: 300 },
      log: console,
    },
  },
  cacheTime: 300,
  onHit: (key) => console.log("hit", key),
  onMiss: (key) => console.log("miss", key),
  onError: (key) => console.log("error", key),
});

prisma.$use(cacheMiddleware as Prisma.Middleware);

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
