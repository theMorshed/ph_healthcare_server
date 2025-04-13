import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { loginUserService } from "./auth.service";
import { sendResponse } from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

export const loginUser = catchAsync(async(req: Request, res: Response) => {
    const result = await loginUserService(req.body);
    const { refreshToken } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true
    });

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Logged in successfully',
        data: {
            accessToken: result.accessToken,
            needsPasswordChange: result.needsPasswordChange
        }
    })
})