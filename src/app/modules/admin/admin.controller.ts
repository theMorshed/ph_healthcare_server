import { NextFunction, Request, Response } from "express";
import { delteteAdminService, getAdminByIDService, getAllAdminService, softDelteteAdminService, updateAdminByIDService } from "./admin.service"
import { pick } from "../../../shared/pick";
import { filterableFields } from "./admin.constant";
import { sendResponse } from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

export const getAllAdmin = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = pick(req.query, filterableFields);
        const options = pick(req.query, ['limit', 'page']);   
        const result = await getAllAdminService(filters, options);
    
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'All admin retrieved successfully',
            meta: result.meta,
            data: result.data
        })    
    } catch(err: any) {
        next(err);
    }
}

export const getAdminByID = async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    try {
        const result = await getAdminByIDService(id);
 
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'admin retrieved successfully',
            data: result
        })       
    } catch(err: any) {
        next(err);
    }
}

export const updateAdminByID = async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    try {
        const result = await updateAdminByIDService(id, req.body);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'admin updated successfully',
            data: result
        })          
    } catch(err: any) {
        next(err);
    }
}

export const deleteAdmin = async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    try {
        const result = await delteteAdminService(id);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'admin deleted successfully',
            data: result
        })         
    } catch(err: any) {
        next(err);
    }
}

export const softDeleteAdmin = async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    try {
        const result = await softDelteteAdminService(id);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'admin soft deleted successfully',
            data: result
        })         
    } catch(err: any) {
        next(err);
    }
}