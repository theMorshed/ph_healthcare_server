import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../shared/catchAsync";
import { pick } from "../../../shared/pick";
import { sendResponse } from "../../../shared/sendResponse";
import { filterableFields } from "./doctor.constant";
import { delteteDoctorService, getAllDoctorService, getDoctorByIDService, softDelteteDoctorService, updateDoctorService } from "./doctor.service";

export const getAllDoctor = catchAsync(async(req, res) => {
    const filters = pick(req.query, filterableFields);
    const options = pick(req.query, ['limit', 'page']);   
    const result = await getAllDoctorService(filters, options);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'All doctor retrieved successfully',
        meta: result.meta,
        data: result.data
    })    
})

export const getDoctorById = catchAsync(async(req, res) => {
    const { id } = req.params;  
    const result = await getDoctorByIDService(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Doctor retrieved successfully',
        data: result
    })    
})

export const updateDoctor = catchAsync(async(req, res) => {
    const { id } = req.params;  
    const result = await updateDoctorService(id, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Doctor updated successfully',
        data: result
    })    
})

export const deleteDoctor = catchAsync(async(req, res) => {
    const { id } = req.params;
    
    const result = await delteteDoctorService(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Doctor deleted successfully',
        data: result
    })         
})

export const softDeleteDoctor = catchAsync(async(req, res) => {
    const { id } = req.params;
    
    const result = await softDelteteDoctorService(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Doctor soft deleted successfully',
        data: result
    })         
})