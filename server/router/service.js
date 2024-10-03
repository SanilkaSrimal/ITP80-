import express from "express";
import {
  createUserService,
  deleteUserService,
  getUserService,
  getUserServices,
  getUserServicesByUser,
  updateUserService,
} from "../controller/serviceController.js";
const serviceRouter = express.Router();

serviceRouter.get("/", getUserServices);
serviceRouter.post("/", createUserService);
serviceRouter.get("/:id", getUserService);
serviceRouter.put("/:id", updateUserService);
serviceRouter.delete("/:id", deleteUserService);
serviceRouter.get("/get-user-service/:id", getUserServicesByUser);

export default serviceRouter;
