import { Request, Response } from "express";
import prisma from "../../lib/prisma";

class CategoryController {
  async index(req: Request, res: Response) {
    const categories = await prisma.category.findMany();

    return res.json(categories);
  }

  async store(req: Request, res: Response) {
    const { name } = req.body;

    const categoryExists = await prisma.category.findUnique({
      where: {
        name,
      },
    });

    if (categoryExists) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return res.json(category);
  }
}

export default new CategoryController();
