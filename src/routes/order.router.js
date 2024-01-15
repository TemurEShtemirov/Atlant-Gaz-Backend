import { Router } from "express";
import { CreateOrder, Get, GetById } from "../controllers/order.controller.js";

const router = Router();

router.get("/", Get);
router.get("/:id", GetById);
router.post("/", CreateOrder);

export default router;
