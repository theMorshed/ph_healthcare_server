import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { createScheduleService } from "./schedule.service";

export const createSchedule = catchAsync(async(req, res) => {
    const result = await createScheduleService(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Schedule created successfully',
        data: result
    })
});