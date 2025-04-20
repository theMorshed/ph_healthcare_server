import { NextFunction, Request, Response } from "express"
import { verifyToken } from "../../helpers/generateToken";
import config from "../../config";
import { Secret } from "jsonwebtoken";

export const auth = (...roles: string[]) => {
    return async(req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            
            if (!token) {
                throw new Error('You are not authorized, Please give your token in headers');
            }

            const verifiedUser = verifyToken(token, config.jwt.access_secret as Secret);

            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new Error('You are not authorized');
            }

            next();
        } catch (err) {
            next(err);
        }
    }
}