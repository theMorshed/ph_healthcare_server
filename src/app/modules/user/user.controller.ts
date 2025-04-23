import { createAdminService, createDoctorService, createPatientService } from "./user.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

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