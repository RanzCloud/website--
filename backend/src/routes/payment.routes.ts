import {Router} from "express";
import auth from "../middleware/auth";
import {PaymentController} from "../controllers/payment.controller";
const r=Router();
r.get("/orders/:invoice/status",auth,PaymentController.status);
r.post("/payments/aksespg/webhook",PaymentController.webhook);
export default r;
