import { Request, Response } from "express";
import { getAllAdminService } from "./admin.service"
import { pick } from "../../../shared/pick";
import { filterableFields } from "./admin.constant";

export const getAllAdmin = async(req: Request, res: Response) => {
    try {
        const filters = pick(req.query, filterableFields);
        const options = pick(req.query, ['limit', 'page']);   
        const result = await getAllAdminService(filters, options);

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