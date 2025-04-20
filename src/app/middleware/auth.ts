import { NextFunction, Request, Response } from "express"
import { verifyToken } from "../../helpers/generateToken";
import config from "../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import { ApiError } from "../../errors/apiError";
import { StatusCodes } from "http-status-codes";

export const auth = (...roles: string[]) => {
    return async(req: Request & {user?: any}, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            
            if (!token) {
                throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized, Please give your token in headers');
            }

            const verifiedUser = verifyToken(token, config.jwt.access_secret as Secret);
            req.user = verifiedUser;

            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new ApiError(StatusCodes.FORBIDDEN, 'Forbidden!');
            }

            next();
        } catch (err) {
            next(err);
        }
    }
}