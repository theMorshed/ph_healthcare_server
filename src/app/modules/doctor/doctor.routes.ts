import { Router } from "express";
import { deleteDoctor, getAllDoctor, getDoctorById, softDeleteDoctor, updateDoctor } from "./doctor.controller";
import { UserRole } from "@prisma/client";
import { auth } from "../../middleware/auth";

const router = Router();

router.get('/', getAllDoctor);
router.get('/:id', getDoctorById);
router.put('/:id', updateDoctor);router.delete('/delete/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), softDeleteDoctor);
router.delete('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), deleteDoctor);

export const doctorRoutes = router;