import { z } from "zod";

export const microserviceBodySchema = z.object({
  name: z
    .string()
    .min(3, "Name must at east be 3 characters.")
    .max(60, "Only 60 characters are allowed."),
  endpointUrl: z.string(),
  enviroment: z
    .enum(["DEVELOPMENT", "STAGING", "PRODUCTION"])
    .default("DEVELOPMENT"),
  status: z.enum(["HEALTHY", "DEGRADED", "DOWN"]).default("HEALTHY"),
  version: z.string(),
});

export const createMicroserviceSchema = z.object({
  body: microserviceBodySchema,
});

export const patchMicroserviceSchema = z.object({
  body: createMicroserviceSchema.partial(),
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a numeric string"),
  }),
});

export const authBodySchema = z.object({
  email: z.string().min(3, "Email must be at least 3 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.enum(["LEAD", "DEVELOPER"]).default("DEVELOPER"),
});

export const createAuthSchema = z.object({ body: authBodySchema });
