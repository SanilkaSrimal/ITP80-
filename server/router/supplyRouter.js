import express from "express";

import {
  getSupplies,
  getSupplyById,
  createSupply,
  updateSupply,
  deleteSupply,
} from "../controller/supplyController.js";

const supplyRouter = express.Router();

supplyRouter.route("/").get(getSupplies).post(createSupply);
supplyRouter
  .route("/:id")
  .get(getSupplyById)
  .put(updateSupply)
  .delete(deleteSupply);

export default supplyRouter;
