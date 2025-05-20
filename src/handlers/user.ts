import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  convertUserToUserDto,
  loginFormSchema,
  userFormSchema,
} from "../models/dtos/user.ts";
import { v4 as uuidv4 } from "uuid";
import { comparePassword, hashPassword } from "../utils/passwordUtils.ts";
import { type User } from "../models/entities.ts";
import type { JwtPayload } from "../models/dtos/common.ts";
import { generateJwtToken } from "../utils/jwtUtils.ts";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { userUpdateSchema } from "../models/dtos/user.ts";
import { userRepo } from "../repo/userRepo.ts";
const userRoutes = new Hono();

userRoutes.post("/register", zValidator("json", userFormSchema), async (c) => {
  // parse request data
  const body = c.req.valid("json");
  const user: User = {
    userId: uuidv4(),
    username: body.username,
    passwordHash: await hashPassword(body.password),
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  logger.debug(
    { username: user.username, email: user.email },
    "Attempting to register new user"
  );

  // check if user already exists
  const existingUser = await userRepo.getUserByUsername(user.username);
  if (existingUser) {
    logger.warn(
      { username: user.username, email: user.email },
      "Registration failed - user already exists"
    );
    return c.json(
      { error: "User already exists with the same username or email" },
      StatusCodes.BAD_REQUEST
    );
  }

  // create user
  const createdUser = await userRepo.createUser(user);
  logger.info(
    { userId: createdUser.userId, username: createdUser.username },
    "User registered successfully"
  );

  return c.json(convertUserToUserDto(createdUser), StatusCodes.CREATED);
});

userRoutes.post("/login", zValidator("json", loginFormSchema), async (c) => {
  const { username, password } = c.req.valid("json");
  logger.debug({ username }, "Login attempt");

  const user = await userRepo.getUserByUsername(username);
  if (!user) {
    logger.warn({ username }, "Login failed - user not found");
    return c.json(
      { error: "Invalid username or password" },
      StatusCodes.UNAUTHORIZED
    );
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    logger.warn({ username }, "Login failed - invalid password");
    return c.json(
      { error: "Invalid username or password" },
      StatusCodes.UNAUTHORIZED
    );
  }

  const payload: JwtPayload = {
    userId: user.userId,
  };

  const token = await generateJwtToken(payload);
  logger.info({ userId: user.userId, username }, "User logged in successfully");

  return c.json({
    token,
    user: convertUserToUserDto(user),
  });
});

userRoutes.get("/:userId", authMiddleware, async (c) => {
  const userId = c.req.param("userId");

  const user = await userRepo.getUserById(userId);

  if (!user) {
    logger.warn({ userId }, "User profile not found");
    return c.json({ message: "User not found" }, StatusCodes.NOT_FOUND);
  }

  logger.info({ userId }, "User profile fetched");
  return c.json(convertUserToUserDto(user), StatusCodes.OK);
});

userRoutes.put(
  "/:userId",
  authMiddleware,
  zValidator("json", userUpdateSchema),
  async (c) => {
    const userIdParam = c.req.param("userId");
    const updates = c.req.valid("json");

    const user = await userRepo.getUserById(userIdParam);
    if (!user) {
      return c.json({ error: "User not found" }, StatusCodes.NOT_FOUND);
    }

    user.email = updates.email ?? user.email;
    user.firstName = updates.firstName ?? user.firstName;
    user.lastName = updates.lastName ?? user.lastName;
    user.passwordHash = updates.password
      ? await hashPassword(updates.password)
      : user.passwordHash;
    user.updatedAt = new Date();

    const updatedUser = await userRepo.updateUser(userIdParam, user);

    if (!updatedUser) {
      return c.json({ error: "User not found" }, StatusCodes.NOT_FOUND);
    }

    return c.json(convertUserToUserDto(updatedUser), StatusCodes.OK);
  }
);

export default userRoutes;
