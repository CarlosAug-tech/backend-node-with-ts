import { Request, Response } from "express";
import prisma from "../../lib/prisma";

class ProductController {
  async show(req: Request, res: Response) {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {},
        image: {},
      },
    });

    return res.json(product);
  }

  async index(req: Request, res: Response) {
    const products = await prisma.product.findMany({
      include: {
        category: {},
        image: {},
      },
    });

    return res.json(products);
  }

  async store(req: Request, res: Response) {
    const { name, amount, description, price, category_id, image_id } =
      req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        amount,
        categoryId: category_id,
        fileId: image_id,
      },
    });

    return res.json(product);
  }
}

export default new ProductController();
