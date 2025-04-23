import { NextFunction, Request, Response, Router } from "express";
import { createAdmin, createDoctor, createPatient } from "./user.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "@prisma/client";
import { upload } from "../../../helpers/fileUploader";
import { adminSchema, doctorSchema, patientSchema } from "./user.validation";

const router = Router();

router.post('/create-admin', 
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), 
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = adminSchema.parse(JSON.parse(req.body.data));
        return createAdmin(req, res, next)
    });

router.post('/create-doctor', 
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), 
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = doctorSchema.parse(JSON.parse(req.body.data));
        return createDoctor(req, res, next)
    });

router.post('/create-patient', 
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = patientSchema.parse(JSON.parse(req.body.data));
        return createPatient(req, res, next)
    });

export const userRoutes = router;