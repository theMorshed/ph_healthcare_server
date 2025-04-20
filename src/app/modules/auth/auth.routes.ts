import { Router } from "express";
import { changePassword, forgetPassword, loginUser, refreshToken, resetPassword } from "./auth.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/change-password', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT), changePassword);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);

export const authRoutes = router;