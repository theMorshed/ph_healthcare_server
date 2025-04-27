import { NextFunction, Request, Response, Router } from "express";
import { createSpecialties, deleteSpecialties, getAllSpecialties } from "./specialties.controller";
import { createSpecialtiesSchema } from "./specialties.validation";
import { upload } from "../../../helpers/fileUploader";
import { auth } from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get('/', getAllSpecialties);
router.post('/', 
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = createSpecialtiesSchema.parse(JSON.parse(req.body.data))
        return createSpecialties(req, res, next);
    });
router.delete('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), deleteSpecialties);

export const specialtiesRoutes = router;