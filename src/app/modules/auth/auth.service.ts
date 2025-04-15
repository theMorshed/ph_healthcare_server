import { UserStatus } from "@prisma/client"
import { prisma } from "../../../shared/prisma"
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from "../../../helpers/generateToken";

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

    const accessToken = generateToken({email: userData.email, role: userData.role}, "abcdefgh", "5m");
    const refreshToken = generateToken({email: userData.email, role: userData.role}, "abcdefghijklmnop", "30d");

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: userData.needsPasswordChange
    }
}

export const refreshTokenService = async(token: string) => {
    let decodedData;
    try {
        decodedData = verifyToken(token, 'abcdefghijklmnop');
    } catch(err) {
        throw new Error('You are not authorized');
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    })

    const accessToken = generateToken({email: userData.email, role: userData.role}, "abcdefgh", "5m");

    return {
        accessToken,
        needsPasswordChange: userData.needsPasswordChange
    }
}