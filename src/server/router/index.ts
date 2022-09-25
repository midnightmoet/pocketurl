// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { urlRouter } from "./url";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("url.", urlRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
