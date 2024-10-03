import express from "express";
import {
  createFuelReqst,
  deleteFuelReqst,
  getFuelReqst,
  updateFuelReqst,
} from "../controller/FuelRequestController.js";

const fuelReqstRouter = express.Router();

fuelReqstRouter.get("/", getFuelReqst);
fuelReqstRouter.post("/", createFuelReqst);
fuelReqstRouter.delete("/:id", deleteFuelReqst);
fuelReqstRouter.put("/:id", updateFuelReqst);

export default fuelReqstRouter;
