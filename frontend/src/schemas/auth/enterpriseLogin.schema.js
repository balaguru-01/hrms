import { z } from "zod";

export const enterpriseLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .max(100, "Email address is too long."),

  password: z
    .string()
    .trim()
    // .min(
    //   8,
    //   "Password must contain at least 8 characters."
    // )
    .max(
      80,
      "Password cannot exceed 80 characters."
    ),
});