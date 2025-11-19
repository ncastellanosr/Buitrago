import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppDataSource } from "../database";
import { AuthUser, UserRole } from "../entities/AuthUser";
import { emailVerification, passwordVerification } from "../verification/authVerification";

export async function register(req: Request, res: Response) {
  try {
    const userRepo = AppDataSource.getRepository(AuthUser);
    const { email, password, name } = req.body;

    // Check input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    //verify email
    if(!emailVerification(email)){
      return res.status(400).json({message: "Email doesn't meet the requirements"})
    }
    // Avoid duplicate emails
    const existing = await userRepo.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email is already registered." });
    }
    //verify password
    if(!passwordVerification(password)){
      return res.status(400).json({ message: "Passwords doesn't meet the requirements." });
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
        id: newUser.id,
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
    const userRepo = AppDataSource.getRepository(AuthUser);
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
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );    
    //Update relvar AuthUser
    user.lastLogin = new Date();
    await userRepo.save(user);
    // Respond
    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
}
export async function changePassword(req: Request, res: Response) {
    try {
    const userRepo = AppDataSource.getRepository(AuthUser);
    const {email, newPassword} = req.body;
    // Check input
    if (!email || !newPassword) {
        return res.status(400).json({ message: "Email and the new password are required." });
    }
    // Find user by email
    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: "Invalid email." });
    }
    //verify password
     if(!passwordVerification(newPassword)){
      return res.status(400).json({ message: "Passwords doesn't meet the requirements." });
    }
    // Hash new password and update
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await userRepo.save(user);
    // confirm message
    return res.status(201).json({"Password change successfully.": user.passwordHash});
    } catch (err) {
        console.error("Fail, not able to update password", err);
        return res.status(500).json({ message: "Internal server error." });
    }

}
