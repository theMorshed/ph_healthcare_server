import { Request, Response } from "express";
import { createAdminService } from "./user.service";

export const createAdmin = async(req: Request, res: Response) => {
    try {
        const result = await createAdminService(req.body);
        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: result
        })
    } catch(err: any) {
        res.status(500).json({
            success: false,
            message: err?.name || 'Something went wrong',
            error: err
        })
    }
}