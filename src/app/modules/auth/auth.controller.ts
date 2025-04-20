import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { changePasswordService, forgetPasswordService, loginUserService, refreshTokenService, resetPasswordService } from "./auth.service";
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

export const refreshToken = catchAsync(async(req: Request, res: Response) => {
    console.log("cookies goes here");
    const { refreshToken } = req.cookies;
    const result = await refreshTokenService(refreshToken);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'refresh token retrieved successfully',
        data: result
    })
})

export const changePassword = catchAsync(async(req: Request & {user?: any}, res: Response) => {
    const user = req.user;
    const result = await changePasswordService(user, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Changed password successfully',
        data: result
    })
})

export const forgetPassword = catchAsync(async(req: Request, res: Response) => {
    await forgetPasswordService(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Check your email',
        data: null
    })
})

export const resetPassword = catchAsync(async(req: Request, res: Response) => {
    const token = req.headers.authorization || "";
    await resetPasswordService(token, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Password Reset successfully',
        data: null
    })
})