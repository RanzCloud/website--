import { Request, Response } from "express";
import prisma from "../config/prisma";
import { provisionOrder } from "../services/provisioning.service";

export class ProvisionController {
  static async retry(req: Request, res: Response) {
    const invoice = String(req.params.invoice);

    const order = await prisma.order.findUnique({
      where: { invoice }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.paymentStatus !== "PAID") {
      return res.status(400).json({
        success: false,
        message: "Belum PAID"
      });
    }

    const server = await provisionOrder(order.id);

    return res.json({
      success: true,
      data: server
    });
  }
}
