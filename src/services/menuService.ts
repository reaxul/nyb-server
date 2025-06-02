import { ObjectId } from "mongodb";
import { menuCollection } from "../config/db";

export class MenuService {
  static async createMenuItem(itemData: any) {
    const item = await menuCollection.insertOne(itemData);
    return item;
  }

  static async getAllMenuItems() {
    const items = await menuCollection.find({}).toArray();
    return items;
  }

  static async getSingleMenu(itemId: string) {
    const item = await menuCollection.findOne({ _id: new ObjectId(itemId) });
    return item;
  }

  static async deleteMenuItem(itemId: string) {
    const id = new ObjectId(itemId);
    const result = await menuCollection.deleteOne({ _id: id });
    return result;
  }

  static async updateMenuStatus(itemId: string, status: string) {
    const id = new ObjectId(itemId);
    const result = await menuCollection.updateOne(
      {
        _id: id,
      },
      { $set: { status } }
    );
    return result;
  }
}
