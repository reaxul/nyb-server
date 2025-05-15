import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { usersCollection } from "../config/db";
import { generateToken } from "../utils/generateToken";

export interface UserData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export class UserService {
  static async createUser(userData: UserData) {
    const existingUser = await usersCollection.findOne({
      email: userData.email,
    });
    if (existingUser) {
      throw new Error("User already exists");
    }

    if (userData.password !== userData.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await usersCollection.insertOne({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: "user",
      status: "active",
      createdAt: new Date(),
    });
  }

  static async login(email: string, password: string) {
    console.log(email, password);
    const user = await usersCollection.findOne({ email });
    console.log(user);
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = generateToken(user.email as string);

    return { user, token };
  }

  static async getAllUsers() {
    const users = await usersCollection.find({}).toArray();
    return users;
  }

  static async deleteUser(id: string) {
    await usersCollection.deleteOne({ _id: new ObjectId(id) });
    return { message: "User deleted successfully" };
  }

  static async updateUser(id: string, userData: UserData) {
    await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: userData }
    );
    return { message: "User updated successfully" };
  }
}
