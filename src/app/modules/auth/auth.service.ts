import { UserStatus } from "@prisma/client"
import { prisma } from "../../../shared/prisma"
import bcrypt from 'bcrypt';
import { generateToken } from "../../../helpers/generateToken";

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