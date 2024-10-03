import express from "express";
import { getSupRequest, putSupRequest, supplyRequest } from "../controller/supplyRequestController.js";

const supplyRequestRouter = express.Router();

supplyRequestRouter.route("/").get(getSupRequest).post(supplyRequest);
supplyRequestRouter.route("/:id").put(putSupRequest);

export default supplyRequestRouter;
