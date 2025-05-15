import type { Request, Response } from "express";
import { UserService } from "../services/userService";
 

export class UserController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, confirmPassword } = req.body;
      await UserService.createUser({ name, email, password, confirmPassword });
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      if (error instanceof Error && error.message === "User already exists") {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error creating user" });
      }
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token } = await UserService.login(email, password);

      res.status(200).json({ user, token });
    } catch (error) {
      if (error instanceof Error && error.message === "User not found") {
        res.status(401).json({ message: error.message });
      } else if (
        error instanceof Error &&
        error.message === "Invalid password"
      ) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error logging in" });
      }
    }
  }

  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }
      await UserService.deleteUser(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user" });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email, password, confirmPassword } = req.body;
      if (!id) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }
      await UserService.updateUser(id, {
        name,
        email,
        password,
        confirmPassword,
      });
      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating user" });
    }
  }
}
