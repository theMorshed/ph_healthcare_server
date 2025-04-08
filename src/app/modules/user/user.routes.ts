import { Router } from "express";
import { createAdmin } from "./user.controller";

const router = Router();

router.post('/', createAdmin);

export const userRoutes = router;