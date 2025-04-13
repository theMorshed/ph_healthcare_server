import { Router } from "express";
import { deleteAdmin, getAdminByID, getAllAdmin, softDeleteAdmin, updateAdminByID } from "./admin.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { updateAdminSchema } from "./admin.validations";

const router = Router();

router.get('/', getAllAdmin);
router.get('/:id', getAdminByID);
router.patch('/:id', validateRequest(updateAdminSchema), updateAdminByID);
router.delete('/delete/:id', softDeleteAdmin);
router.delete('/:id', deleteAdmin);

export const adminRoutes = router;