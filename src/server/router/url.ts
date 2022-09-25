import { z } from "zod";
import { createProtectedRouter } from "./context";
import cuid from "cuid";

export const urlRouter = createProtectedRouter()
  .mutation("shorten", {
    input: z.object({
      longURL: z.string().url(),
      code: z.string().optional(),
      baseURL: z.string().url(),
    }),
    async resolve({ ctx, input }) {
      const code = input.code || cuid.slug();
      const shortURL = `${input.baseURL}${code}`;
      const isCreated =
        typeof (
          await ctx.prisma.uRL.create({
            data: {
              longURL: input.longURL,
              code,
              userId: ctx.session.user.id,
              shortURL,
            },
            select: {
              id: true,
            },
          })
        ).id === "string";

      if (isCreated) {
        return { code, shortURL, error: false };
      } else return { code: "", shortURL: "", error: true };
    },
    output: z.object({
      code: z.string(),
      shortURL: z.string().url(),
      error: z.boolean().default(false),
    }),
  })
  .query("getLongURL", {
    input: z.object({
      code: z.string(),
    }),
    async resolve({ ctx, input }) {
      const output = await ctx.prisma.uRL.findFirst({
        where: { code: input.code },
        select: { longURL: true, id: true, redirects: true },
      });
      if (output) {
        return {
          longURL: output.longURL,
          id: output.id,
          redirects: output.redirects,
          notFound: false,
        };
      } else return { longURL: "", id: "", redirects: -1, notFound: true };
    },
    output: z.object({
      longURL: z.string(),
      notFound: z.boolean().default(false),
      id: z.string().cuid(),
      redirects: z.number(),
    }),
  })
  .mutation("increaseRedirectCount", {
    input: z.object({ id: z.string().cuid(), redirects: z.number() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.uRL.update({
        where: { id: input.id },
        data: {
          redirects: input.redirects,
        },
      });
    },
  })
  .query("list", {
    async resolve({ ctx }) {
      return await ctx.prisma.uRL.findMany({
        where: { userId: ctx.session.user.id },
      });
    },
  });
