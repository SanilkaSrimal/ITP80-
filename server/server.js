import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";

import userRouter from "./router/userRouter.js";
import salaryRouter from "./router/salaryrouter.js";
import productRouter from "./router/productRouter.js";
import supplyRouter from "./router/supplyRouter.js";
import promotionRouter from "./router/promotionRouter.js";
import messageRouter from "./controller/sentMessage.js";
import supplyRequestRouter from "./router/supplyRequestRouter.js";
import orderRouter from "./router/orderRouter.js";
import feedbackRouter from "./router/feedbackRouter.js";
import serviceRouter from "./router/service.js";

const app = express();

app.use(cors());
app.use(bodyParser.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({ extended: true, limit:"50mb" }));

app.use("/auth", userRouter);
app.use("/salary", salaryRouter);
app.use("/products", productRouter);
app.use("/supplies", supplyRouter);
app.use("/coupon", promotionRouter);
app.use("/message", messageRouter);
app.use("/supply-request", supplyRequestRouter);
app.use("/orders", orderRouter);
app.use("/feedback", feedbackRouter);
app.use("/service", serviceRouter);

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// MongoDB connection
connectMongoDB();
