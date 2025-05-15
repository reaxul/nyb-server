import { ObjectId } from "mongodb";
import { ordersCollection } from "../config/db";
import type { TOrder } from "../types/order-type";

export class OrderService {
  static async createOrder(orderData: TOrder) {
    const order = await ordersCollection.insertOne(orderData);
    return order;
  }

  static async getAllOrders() {
    const orders = await ordersCollection.find({}).toArray();
    return orders;
  }

  static async getOrderById(orderId: string) {
    try {
      // Try to convert to ObjectId for MongoDB _id
      const id = new ObjectId(orderId);
      const order = await ordersCollection.findOne({ _id: id });
      return order;
    } catch (error) {
      // If not a valid ObjectId, try as a string id
      const order = await ordersCollection.findOne({ orderId });
      return order;
    }
  }

  static async getOrdersByUserId(userId: string) {
    console.log(userId);
    const orders = await ordersCollection.find({ userId }).toArray();
    return orders;
  }

  static async updateOrderStatus(orderId: string, status: string) {
    try {
      // Try to convert to ObjectId for MongoDB _id
      const id = new ObjectId(orderId);
      const result = await ordersCollection.updateOne(
        { _id: id },
        { $set: { status } }
      );

      if (result.matchedCount === 0) {
        // If not found by _id, try by orderId string
        return await ordersCollection.updateOne(
          { orderId },
          { $set: { status } }
        );
      }

      return result;
    } catch (error) {
      // If not a valid ObjectId, try as a string id
      return await ordersCollection.updateOne(
        { orderId },
        { $set: { status } }
      );
    }
  }

  static async deleteOrder(orderId: string) {
    try {
      // Try to convert to ObjectId for MongoDB _id
      const id = new ObjectId(orderId);
      const result = await ordersCollection.deleteOne({ _id: id });

      if (result.deletedCount === 0) {
        // If not found by _id, try by orderId string
        const stringResult = await ordersCollection.deleteOne({ orderId });

        if (stringResult.deletedCount === 0) {
          throw new Error("Order not found");
        }

        return stringResult;
      }

      return result;
    } catch (error) {
      if (error instanceof Error && error.message === "Order not found") {
        throw error;
      }

      // If not a valid ObjectId, try as a string id
      const result = await ordersCollection.deleteOne({ orderId });

      if (result.deletedCount === 0) {
        throw new Error("Order not found");
      }

      return result;
    }
  }
}
