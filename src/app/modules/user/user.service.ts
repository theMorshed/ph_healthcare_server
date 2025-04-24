import { Admin, Doctor, Patient, Prisma, User, UserRole, UserStatus } from "@prisma/client";
import bcrypt from 'bcrypt';
import { prisma } from "../../../shared/prisma";
import { uploadToCloudinary } from "../../../helpers/fileUploader";
import { Request } from "express";
import { IFile } from "../../../types/file";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { userSearchableFields } from "./user.constant";
import { TAuthUser } from "../../../types/common";

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

export const getAllUserService = async(params: any, options: any) => {    
    const { searchTerm, ...filterData } = params;
    const { limit, page, skip } = calculatePagination(options);
    const conditions: Prisma.UserWhereInput[] = [];    

    if (params.searchTerm) {
        conditions.push({
            OR: userSearchableFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        conditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        })
    }

    const whereConditons: Prisma.UserWhereInput = conditions.length > 0 ? {AND: conditions} : {};

    const result = await prisma.user.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            needsPasswordChange: true,
            createdAt: true,
            updatedAt: true,
            admin: true,
            patient: true,
            doctor: true,
        }
    });

    const total = await prisma.user.count({
        where: whereConditons
    })

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }
}

export const updateProfileStatusService = async(id: string, status: UserRole) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    })

    const updateStatus = await prisma.user.update({
        where: {
            id
        },
        data: status
    })

    return updateStatus;
}

export const getMyProfileService = async(user: TAuthUser) => {
    let userRole: string;

    if (user?.role === 'SUPER_ADMIN') {
        userRole = 'admin';
    } else {
        userRole = user?.role.toLowerCase() as string;
    }

    const selectObj = {
        id: true,
        email: true,
        needsPasswordChange: true,
        role: true,
        status: true, 
        [userRole]: true
    }

    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            status: UserStatus.ACTIVE
        },
        select: {
            ...selectObj  
        }
    })

    return userInfo;
}