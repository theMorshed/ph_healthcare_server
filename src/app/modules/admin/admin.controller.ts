import { Request, Response } from "express";
import { getAllAdminService } from "./admin.service"

export const getAllAdmin = async(req: Request, res: Response) => {
    try {
        const result = await getAllAdminService(req.query);

        res.status(200).json({
            success: true,
            message: 'All admin retrieved successfully',
            data: result
        })        
    } catch(err: any) {
        res.status(500).json({
            success: false,
            message: err.name || 'Something went wrong',
            error: err
        })
    }
}