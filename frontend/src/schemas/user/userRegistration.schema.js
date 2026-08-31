import { z } from "zod";

const PHONE_PATTERN =
  /^[0-9+\-()\s]{7,20}$/;

const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,80}$/;

export const userRegistrationSchema =
  z
    .object({
      firstName: z
        .string()
        .trim()
        .min(
          1,
          "Please enter your first name."
        )
        .max(
          50,
          "First name cannot exceed 50 characters."
        ),

      lastName: z
        .string()
        .trim()
        .min(
          1,
          "Please enter your last name."
        )
        .max(
          50,
          "Last name cannot exceed 50 characters."
        ),

      email: z
        .string()
        .trim()
        .email(
          "Please enter a valid email address."
        )
        .max(
          254,
          "Email address is too long."
        ),

      password: z
        .string()
        .min(
          8,
          "Password must contain at least 8 characters."
        )
        .max(
          80,
          "Password cannot exceed 80 characters."
        )
        .refine(
          (value) =>
            PASSWORD_PATTERN.test(value),
          {
            message:
              "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
          }
        ),

      confirmPassword: z
        .string()
        .min(
          1,
          "Please confirm your password."
        ),

      phone: z
        .string()
        .trim()
        .min(
          7,
          "Please enter a valid phone number."
        )
        .max(
          20,
          "Phone number cannot exceed 20 characters."
        )
        .refine(
          (value) =>
            PHONE_PATTERN.test(value),
          {
            message:
              "Please enter a valid phone number.",
          }
        ),

      location: z
        .string()
        .trim()
        .min(
          1,
          "Please enter your location."
        )
        .max(
          100,
          "Location cannot exceed 100 characters."
        ),
    })
    .refine(
      (data) =>
        data.password ===
        data.confirmPassword,
      {
        message:
          "Passwords do not match.",
        path: ["confirmPassword"],
      }
    );