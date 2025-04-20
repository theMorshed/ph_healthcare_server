import { UserStatus } from "@prisma/client"
import { prisma } from "../../../shared/prisma"
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from "../../../helpers/generateToken";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import { emailSender } from "./emailSender";
import { ApiError } from "../../../errors/apiError";
import { StatusCodes } from "http-status-codes";

export const loginUserService = async(payload: {email: string, password: string}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })

    const isCorrectPassword = await bcrypt.compare(payload.password, userData.password);
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

export const changePasswordService = async(user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    })

    const isCorrectPassword = await bcrypt.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new Error('Password Incorrect!');
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

    await prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword,
            needsPasswordChange: false
        }
    })

    return {
        message: 'Password Changed successfully'
    }
}

export const forgetPasswordService = async(payload: {email: string}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })

    const resetPassToken = generateToken({email: userData.email, role: userData.role}, config.jwt.reset_secret as Secret, config.jwt.reset_expires_in);

    const resetPassLink = config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;
    // console.log(resetPassLink);

    await emailSender(userData.email, 
        `
            <div>
                <p>Dear User, Your password reset link: </p>
                <a href=${resetPassLink}>
                    <button>Reset Password</button>
                </a>
            </div>
        `
    )
}

export const resetPasswordService = async(token: string, payload: {id: string, password: string}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE
        }
    })

    const isValidToken = verifyToken(token, config.jwt.reset_secret as Secret);
    if (!isValidToken) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'Forbidden!');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    await prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password: hashedPassword
        }
    })
}