import { UserRole } from "@prisma/client";
import bcrypt from 'bcrypt';
import { prisma } from "../../../shared/prisma";

export const createAdminService = async(payload: any) => {
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const userData = {
        password: hashedPassword,
        email: payload.admin.email,
        role: UserRole.ADMIN
    }

    const result = prisma.$transaction(async(transactionClient) => {
        const createUser = await transactionClient.user.create({
            data: userData
        })

        const createAdmin = await transactionClient.admin.create({
            data: payload.admin
        })

        return createAdmin;
    })

    return result;
}