import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AksesPGService } from "../services/aksespg.service";
import { provisionOrder } from "../services/provisioning.service";

export class PaymentController {
  static async status(req: Request, res: Response) {
    const invoice = String(req.params.invoice);

    const order = await prisma.order.findUnique({
      where: { invoice },
      include: { server: true }
    });

    if (!order || order.userId !== req.user?.id) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.paymentStatus === "PENDING" && order.depositId) {
      try {
        const payment = await AksesPGService.status(order.depositId);

        const paymentStatus = String(
          payment?.status || ""
        ).toLowerCase();

        if (
          ["success", "paid", "settled", "completed"].includes(paymentStatus)
        ) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: "PAID",
              paymentReference: order.depositId
            }
          });

          try {
            await provisionOrder(order.id);
          } catch (error) {
            console.error(
              "Provisioning after payment failed:",
              error
            );
          }
        } else if (
          ["expired", "cancelled", "failed"].includes(paymentStatus)
        ) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: paymentStatus.toUpperCase()
            }
          });
        }
      } catch (error) {
        console.error(
          "AksesPG status check failed:",
          error
        );
      }
    }

    const freshOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: { server: true }
    });

    return res.json({
      success: true,
      data: {
        invoice: freshOrder?.invoice,
        status: freshOrder?.paymentStatus,
        provisioned: freshOrder?.provisioned,
        server: freshOrder?.server
          ? {
              panelUrl: freshOrder.server.panelUrl,
              username: freshOrder.server.username,
              serverName: freshOrder.server.serverName
            }
          : null
      }
    });
  }

  static async webhook(req: Request, res: Response) {
    return res.status(410).json({
      success: false,
      message: "Use AksesPG Check Status polling"
    });
  }
}
