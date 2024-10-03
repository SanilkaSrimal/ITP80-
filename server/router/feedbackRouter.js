import express from "express";
import { createFeedback, deleteFeedback, getFeedback } from "../controller/feedbackController.js";

const feedbackRouter = express.Router();

feedbackRouter.get("/", getFeedback);
feedbackRouter.post("/", createFeedback);
feedbackRouter.delete("/:id", deleteFeedback);


export default feedbackRouter;
