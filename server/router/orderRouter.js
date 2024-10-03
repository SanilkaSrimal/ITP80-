import express from "express";
import {
  createOrder,
  createPaymentIntent,
  DeleteOrder,
  getAllOrders,
  getOrdersByUserId,
  updateOrderStatus,
} from "../controller/orderController.js";

const orderRouter = express.Router();
orderRouter.get("/", getAllOrders);
orderRouter.post("/", createOrder);
orderRouter.post("/create-payment-intent", createPaymentIntent);
orderRouter.get("/get-user-orders/:id", getOrdersByUserId);
orderRouter.put("/:id", updateOrderStatus);
orderRouter.delete("/:id",DeleteOrder); 

export default orderRouter;
