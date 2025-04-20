import { Router } from "express";
import { deleteAdmin, getAdminByID, getAllAdmin, softDeleteAdmin, updateAdminByID } from "./admin.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { updateAdminSchema } from "./admin.validations";
import { auth } from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get('/', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), getAllAdmin);
router.get('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), getAdminByID);
router.patch('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), validateRequest(updateAdminSchema), updateAdminByID);
router.delete('/delete/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), softDeleteAdmin);
router.delete('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), deleteAdmin);

export const adminRoutes = router;