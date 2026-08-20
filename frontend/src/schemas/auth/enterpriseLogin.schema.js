import { z } from "zod";

export const enterpriseLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(
      1,
      "Please enter your email address."
    )
    .email(
      "Please enter a valid email address."
    ),

  password: z
    .string()
    .min(
      1,
      "Please enter your password."
    ),
});