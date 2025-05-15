import type { Request, Response } from "express";
import { OrderService } from "../services/orderService";

export class OrderController {
  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      // Add default values if not provided
      if (!data.date) {
        data.date = new Date();
      }
      if (!data.status) {
        data.status = "pending";
      }

      await OrderService.createOrder(data);

      res.status(201).json({ message: "Order created successfully" });
    } catch (error) {
      if (error instanceof Error && error.message === "Order already exists") {
        res.status(409).json({ message: "Order already exists" });
      } else {
        res.status(500).json({ message: "Error creating order" });
      }
    }
  }

  static async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json({ orders });
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  }

  static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "Order ID is required" });
        return;
      }

      const order = await OrderService.getOrderById(id);

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      res.status(200).json({ order });
    } catch (error) {
      res.status(500).json({ message: "Error fetching order" });
    }
  }

  static async getOrdersByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      const orders = await OrderService.getOrdersByUserId(userId);
      res.status(200).json({ orders });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user orders" });
    }
  }

  static async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        res.status(400).json({ message: "Order ID is required" });
        return;
      }

      if (!status) {
        res.status(400).json({ message: "Status is required" });
        return;
      }

      // Validate status
      const validStatuses = ["pending", "processing", "completed", "cancelled"];
      if (!validStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status value" });
        return;
      }

      const result = await OrderService.updateOrderStatus(id, status);

      if (!result.matchedCount) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      res.status(200).json({ message: "Order status updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating order status" });
    }
  }

  static async deleteOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "Order ID is required" });
        return;
      }

      await OrderService.deleteOrder(id);
      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      if (error instanceof Error && error.message === "Order not found") {
        res.status(404).json({ message: "Order not found" });
      } else {
        res.status(500).json({ message: "Error deleting order" });
      }
    }
  }
}
