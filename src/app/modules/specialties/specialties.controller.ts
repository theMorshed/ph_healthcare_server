import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { createSpecialtiesService, deleteSpecialtiesService, getAllSpecialtiesService } from "./specialties.service";
import { sendResponse } from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

export const createSpecialties = catchAsync(async(req: Request, res: Response) => {
    const result = await createSpecialtiesService(req);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Specialties Created successfully!',
        data: result
    })
})

export const getAllSpecialties = catchAsync(async(req: Request, res: Response) => {
    const result = await getAllSpecialtiesService();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Specialties retrieved successfully!',
        data: result
    })
})

export const deleteSpecialties = catchAsync(async(req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteSpecialtiesService(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Specialties deleted successfully!',
        data: result
    })
})