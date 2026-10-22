import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().int().default(4000),
  FRONTEND_ORIGIN: z.string().url().default("http://localhost:3000"),
});

export const config = schema.parse(process.env);
