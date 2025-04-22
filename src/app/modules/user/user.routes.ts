import { NextFunction, Request, Response, Router } from "express";
import { createAdmin } from "./user.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "@prisma/client";
import { upload, uploadToCloudinary } from "../../../helpers/fileUploader";
import { adminSchema } from "./user.validation";

const router = Router();

router.post('/', 
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), 
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = adminSchema.parse(JSON.parse(req.body.data));
        return createAdmin(req, res, next)
    });

export const userRoutes = router;