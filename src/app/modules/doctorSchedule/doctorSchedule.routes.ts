import { Router } from "express";
import { auth } from "../../middleware/auth";
import { UserRole } from "@prisma/client";
import { createDoctorSchedule } from "./doctorSchedule.controller";

const router = Router();

router.post('/', auth(UserRole.DOCTOR), createDoctorSchedule);

export const doctorScheduleRoutes = router;