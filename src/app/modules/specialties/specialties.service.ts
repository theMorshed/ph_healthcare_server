import { Request } from "express";
import { IFile } from "../../../types/file";
import { uploadToCloudinary } from "../../../helpers/fileUploader";
import { prisma } from "../../../shared/prisma";

export const createSpecialtiesService = async(req: Request) => {
    const file = req.file as IFile;

    if (file) {
        const uploadedFile = await uploadToCloudinary(file);
        req.body.icon = uploadedFile?.secure_url;
    }

    const result = await prisma.specialties.create({
        data: req.body
    })

    return result;
}

export const getAllSpecialtiesService = async() => {
    return await prisma.specialties.findMany();
}

export const deleteSpecialtiesService = async(id: string) => {
    const result = await prisma.specialties.delete({
        where: {
            id
        }
    });

    return result;
}