import { createAdminService, createDoctorService, createPatientService, getAllUserService } from "./user.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { pick } from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";

export const createAdmin = catchAsync(async(req, res) => {
    const result = await createAdminService(req);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Admin created successfully',
        data: result
    })
});

export const createDoctor = catchAsync(async(req, res) => {
    const result = await createDoctorService(req);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Doctor created successfully',
        data: result
    })
});

export const createPatient = catchAsync(async(req, res) => {
    const result = await createPatientService(req);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Patient created successfully',
        data: result
    })
});

export const getAllUser = catchAsync(async(req, res) => {
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ['limit', 'page']);   
    const result = await getAllUserService(filters, options);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'All user retrieved successfully',
        meta: result.meta,
        data: result.data
    })    
})