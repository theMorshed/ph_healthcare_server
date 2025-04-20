import { Router } from "express";
import { createAdmin } from "./user.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post('/', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), createAdmin);

export const userRoutes = router;