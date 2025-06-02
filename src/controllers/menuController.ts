import type { Request, Response } from "express";
import { MenuService } from "../services/menuService";

export class MenuController {
  static async createMenuItem(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      // Add default values if not provided
      if (!data.date) {
        data.date = new Date();
      }
      if (!data.status) {
        data.status = "available";
      }

      await MenuService.createMenuItem(data);

      res.status(201).json({ message: "Menu item created successfully" });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Menu item already exists"
      ) {
        res.status(409).json({ message: "Menu item already exists" });
      } else {
        res.status(500).json({ message: "Error creating menu item" });
      }
    }
  }

  static async getAllMenuItems(req: Request, res: Response): Promise<void> {
    try {
      const items = await MenuService.getAllMenuItems();
      res.status(200).json({ items });
    } catch (error) {
      res.status(500).json({ message: "Error fetching menu items" });
    }
  }

  static async getSingleMenu(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "Menu item ID is required" });
        return;
      }
      const item = await MenuService.getSingleMenu(id);
      res.status(200).json({ item });
    } catch (error) {
      res.status(500).json({ message: "Error fetching single Menu" });
    }
  }

  static async deleteMenuItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "Menu item ID is required" });
        return;
      }

      const result = await MenuService.deleteMenuItem(id);

      if (result.deletedCount === 0) {
        res.status(404).json({ message: "Menu item not found" });
        return;
      }

      res.status(200).json({ message: "Menu item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting menu item" });
    }
  }

  static async updateMenuStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id || !status) {
        res
          .status(400)
          .json({ message: "Menu item ID and status are required" });
        return;
      }

      const result = await MenuService.updateMenuStatus(id, status);

      if (result.matchedCount === 0) {
        res.status(404).json({ message: "Menu item not found" });
        return;
      }

      res
        .status(200)
        .json({ message: "Menu item status updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating menu item status" });
    }
  }
}
