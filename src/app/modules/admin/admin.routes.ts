import { Router } from "express";
import { getAllAdmin } from "./admin.controller";

const router = Router();

router.get('/', getAllAdmin);

export const adminRoutes = router;