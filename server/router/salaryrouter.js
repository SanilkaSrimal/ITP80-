import express from "express";
import { createSalary, deleteSalary, getSalary } from "../controller/salaryController.js";

const salaryRouter = express.Router();

salaryRouter.get("/", getSalary);
// salaryRouter.get("/:id", getSalaryById);
salaryRouter.post("/", createSalary);
// salaryRouter.put("/:id", updateSalary);
salaryRouter.delete("/:id", deleteSalary);

export default salaryRouter;
