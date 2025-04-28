import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { TAuthUser } from "../../../types/common";
import { createDoctorScheduleService } from "./doctorSchedule.service";
import { sendResponse } from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

export const createDoctorSchedule = catchAsync(async (req: Request & { user?: TAuthUser }, res: Response) => {

    const user = req.user;
    const result = await createDoctorScheduleService(user, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctor Schedule created successfully!",
        data: result
    });
});