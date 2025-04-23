import { Admin, Doctor, Patient, UserRole } from "@prisma/client";
import bcrypt from 'bcrypt';
import { prisma } from "../../../shared/prisma";
import { uploadToCloudinary } from "../../../helpers/fileUploader";
import { Request } from "express";
import { IFile } from "../../types/file";

export const createAdminService = async(req: Request): Promise<Admin> => {
    const file = req.file as IFile;
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

export const createDoctorService = async(req: Request): Promise<Doctor> => {
    const file = req.file as IFile;
    if (file) {
        const uploadedPhoto = await uploadToCloudinary(file);
        req.body.doctor.profilePhoto = uploadedPhoto?.secure_url
    }
    const data = req.body;
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = {
        password: hashedPassword,
        email: data.doctor.email,
        role: UserRole.DOCTOR
    }

    const result = prisma.$transaction(async(transactionClient) => {
        const createUser = await transactionClient.user.create({
            data: userData
        })

        const createDoctor = await transactionClient.doctor.create({
            data: data.doctor
        })

        return createDoctor;
    })

    return result;
}

export const createPatientService = async(req: Request): Promise<Patient> => {
    const file = req.file as IFile;
    if (file) {
        const uploadedPhoto = await uploadToCloudinary(file);
        req.body.patient.profilePhoto = uploadedPhoto?.secure_url;
    }
    const data = req.body;
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = {
        password: hashedPassword,
        email: data.patient.email,
        role: UserRole.PATIENT
    }

    const result = prisma.$transaction(async(transactionClient) => {
        const createUser = await transactionClient.user.create({
            data: userData
        })

        const createPatient = await transactionClient.patient.create({
            data: data.patient
        })

        return createPatient;
    })

    return result;
}