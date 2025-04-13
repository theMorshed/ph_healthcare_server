import { delteteAdminService, getAdminByIDService, getAllAdminService, softDelteteAdminService, updateAdminByIDService } from "./admin.service"
import { pick } from "../../../shared/pick";
import { filterableFields } from "./admin.constant";
import { sendResponse } from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../shared/catchAsync";

export const getAllAdmin = catchAsync(async(req, res) => {
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
})

export const getAdminByID = catchAsync(async(req, res) => {
    const { id } = req.params;
    
    const result = await getAdminByIDService(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'admin retrieved successfully',
        data: result
    })       
})

export const updateAdminByID = catchAsync(async(req, res) => {
    const { id } = req.params;
    
    const result = await updateAdminByIDService(id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'admin updated successfully',
        data: result
    })          
  
})

export const deleteAdmin = catchAsync(async(req, res) => {
    const { id } = req.params;
    
    const result = await delteteAdminService(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'admin deleted successfully',
        data: result
    })         
})

export const softDeleteAdmin = catchAsync(async(req, res) => {
    const { id } = req.params;
    
    const result = await softDelteteAdminService(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'admin soft deleted successfully',
        data: result
    })         
})