import { Router } from "express";
import { deleteAdmin, getAdminByID, getAllAdmin, softDeleteAdmin, updateAdminByID } from "./admin.controller";

const router = Router();

router.get('/', getAllAdmin);
router.get('/:id', getAdminByID);
router.patch('/:id', updateAdminByID);
router.delete('/delete/:id', softDeleteAdmin);
router.delete('/:id', deleteAdmin);

export const adminRoutes = router;