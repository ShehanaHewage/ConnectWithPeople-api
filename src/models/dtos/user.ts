import { z } from "zod";
import type { User } from "../entities.ts";

export const userFormSchema = z.object({
  username: z.string().min(5, "Username must be at least 5 characters long"),
  password: z.string().min(5, "Password must be at least 5 characters long"),
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
});

export type UserFormDto = z.infer<typeof userFormSchema>;

export const loginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type LoginFormDto = z.infer<typeof loginFormSchema>;

export const userDto = z.object({
  userId: z.string(),
  username: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string().optional(),
});

export type UserDto = z.infer<typeof userDto>;

export function convertUserToUserDto(user: User): UserDto {
  return {
    userId: user.userId,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName ?? undefined,
  };
}

export const getUserSchema = z.object({
  userId: z.string(),
});

export const userUpdateSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string().min(6).optional(),
});
