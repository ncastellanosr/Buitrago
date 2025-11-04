import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppDataSource } from "../database";
import { AuthUser, UserRole } from "../entities/AuthUser";

const userRepo = AppDataSource.getRepository(AuthUser);

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;

    // Check input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Avoid duplicate emails
    const existing = await userRepo.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = userRepo.create({
      email,
      passwordHash: hashed,
      name,
      role: UserRole.USER,
      isActive: true,
    });

    await userRepo.save(newUser);

    // Respond
    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: newUser.userId,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Check input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find user by email
    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Compare password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // Respond
    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.userId,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
}
