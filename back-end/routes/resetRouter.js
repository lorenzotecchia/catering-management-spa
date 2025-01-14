import express from "express";
import { ResetController } from "../controllers/ResetController.js";

export const resetRouter = new express.Router();

resetRouter.post("/reset", (req, res, next) => {
  ResetController.resetApp(req, res).then( () => {
    res.json();
  }).catch(err => {
    next(err);
  })
});