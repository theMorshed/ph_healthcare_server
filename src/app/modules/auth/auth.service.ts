import { UserStatus } from "@prisma/client"
import { prisma } from "../../../shared/prisma"
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from "../../../helpers/generateToken";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

export const loginUserService = async(payload: {email: string, password: string}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })

    const isCorrectPassword = bcrypt.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error('Password Incorrect!');
    }

    const accessToken = generateToken({email: userData.email, role: userData.role}, config.jwt.access_secret as Secret, config.jwt.access_expires_in);
    const refreshToken = generateToken({email: userData.email, role: userData.role}, config.jwt.refresh_secret as Secret, config.jwt.refresh_expires_in);

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: userData.needsPasswordChange
    }
}

export const refreshTokenService = async(token: string) => {
    let decodedData;
    try {
        decodedData = verifyToken(token, config.jwt.refresh_secret as Secret);
    } catch(err) {
        throw new Error('You are not authorized');
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    })

    const accessToken = generateToken({email: userData.email, role: userData.role}, config.jwt.access_secret as Secret, config.jwt.access_expires_in);

    return {
        accessToken,
        needsPasswordChange: userData.needsPasswordChange
    }
}