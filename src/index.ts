import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db";
import { MenuController } from "./controllers/menuController";
import { OrderController } from "./controllers/orderContollers";
import { UserController } from "./controllers/userController";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://nyb-restaurant-three.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User Routes
app.post("/signup", UserController.signup);
app.post("/login", UserController.login);
app.get("/users", UserController.getAllUsers);
app.delete("/users/:id", UserController.deleteUser);
app.put("/users/:id", UserController.updateUser);

// Order Routes
app.get("/orders", OrderController.getAllOrders);
app.post("/orders", OrderController.createOrder);
app.get("/orders/:id", OrderController.getOrderById);
app.patch("/orders/:id/status", OrderController.updateOrderStatus);
app.delete("/orders/:id", OrderController.deleteOrder);
app.get("/users/:userId/orders", OrderController.getOrdersByUserId);

// menus route
app.post("/menu", MenuController.createMenuItem);
app.get("/menu", MenuController.getAllMenuItems);
app.get("/menu/:id", MenuController.getSingleMenu);
app.delete("/menu/:id", MenuController.deleteMenuItem);
app.patch("/menu/:id", MenuController.updateMenuStatus);

// Connect to database and start server
async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
