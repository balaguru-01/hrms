import { z } from "zod";

const EMAIL_PATTERN =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

const DESIGNATION_PATTERN =
  /^[A-Za-z0-9][A-Za-z0-9 ._&/-]*$/;

export const inviteUserSchema = z.object({
  email: z
    .string()
    .trim()
    .min(
      1,
      "Please enter the email address."
    )
    .max(
      254,
      "Email address is too long."
    )
    .refine(
      (value) =>
        !/\s/.test(value),
      {
        message:
          "Email address cannot contain spaces.",
      }
    )
    .refine(
      (value) =>
        EMAIL_PATTERN.test(value),
      {
        message:
          "Please enter a valid email address.",
      }
    ),

  designation: z
    .string()
    .trim()
    .min(
      2,
      "Designation must contain at least 2 characters."
    )
    .max(
      100,
      "Designation cannot exceed 100 characters."
    )
    .refine(
      (value) =>
        DESIGNATION_PATTERN.test(value),
      {
        message:
          "Designation contains unsupported characters.",
      }
    ),

  roleId: z
    .string()
    .trim()
    .min(
      1,
      "Please select a role."
    ),
});