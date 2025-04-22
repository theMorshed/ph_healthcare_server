import { UserRole } from "@prisma/client";
import bcrypt from 'bcrypt';
import { prisma } from "../../../shared/prisma";
import { uploadToCloudinary } from "../../../helpers/fileUploader";

export const createAdminService = async(req: any) => {
    const file = req.file;
    if (file) {
        const uploadedPhoto = await uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadedPhoto?.secure_url
    }
    const data = req.body;
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = {
        password: hashedPassword,
        email: data.admin.email,
        role: UserRole.ADMIN
    }

    const result = prisma.$transaction(async(transactionClient) => {
        const createUser = await transactionClient.user.create({
            data: userData
        })

        const createAdmin = await transactionClient.admin.create({
            data: data.admin
        })

        return createAdmin;
    })

    return result;
}