import { NextFunction, Request, Response, Router } from "express";
import { createAdmin, createDoctor, createPatient, getAllUser, getMyProfile, updateProfileStatus } from "./user.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "@prisma/client";
import { upload } from "../../../helpers/fileUploader";
import { adminSchema, doctorSchema, patientSchema, updateStatusSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

router.get('/', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), getAllUser);

router.get('/me', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT), getMyProfile);

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

router.patch('/:id/status', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), validateRequest(updateStatusSchema), updateProfileStatus);

export const userRoutes = router;