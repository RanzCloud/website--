import { Request, Response } from "express";
import prisma from "../config/prisma";

export class ProductController {
  static async publicList(_req: Request, res: Response) {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" }
    });

    return res.json({
      success: true,
      data: products
    });
  }

  static async adminList(_req: Request, res: Response) {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" }
    });

    return res.json({
      success: true,
      data: products
    });
  }

  static async create(req: Request, res: Response) {
    const x = req.body;

    const product = await prisma.product.create({
      data: {
        name: String(x.name),
        ram: Number(x.ram),
        disk: Number(x.disk),
        cpu: Number(x.cpu),
        price: Number(x.price),
        description: x.description
          ? String(x.description)
          : undefined,
        active: x.active !== false
      }
    });

    return res.status(201).json({
      success: true,
      data: product
    });
  }

  static async update(req: Request, res: Response) {
    const id = String(req.params.id);

    const product = await prisma.product.update({
      where: { id },
      data: req.body
    });

    return res.json({
      success: true,
      data: product
    });
  }

  static async remove(req: Request, res: Response) {
    const id = String(req.params.id);

    await prisma.product.delete({
      where: { id }
    });

    return res.json({
      success: true
    });
  }
}
