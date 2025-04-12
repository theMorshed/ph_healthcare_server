import { Admin, Prisma, UserStatus } from "@prisma/client"
import { searchableFields } from "./admin.constant";
import { prisma } from "../../../shared/prisma";
import { calculatePagination } from "../../../helpers/paginationHelper";

export const getAllAdminService = async(params: any, options: any) => {    
    const { searchTerm, ...filterData } = params;
    const { limit, page, skip } = calculatePagination(options);
    const conditions: Prisma.AdminWhereInput[] = [];    

    if (params.searchTerm) {
        conditions.push({
            OR: searchableFields.map(field => ({
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

    conditions.push({
        isDeleted: false
    })

    const whereConditons: Prisma.AdminWhereInput = {AND: conditions};

    const result = await prisma.admin.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });

    const total = await prisma.admin.count({
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

export const getAdminByIDService = async(id: string): Promise<Admin | null> => {
    const result = await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    return result;
}

export const updateAdminByIDService = async(id: string, data: Partial<Admin>): Promise<Admin> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    const result = await prisma.admin.update({
        where: {
            id
        },
        data
    });

    return result;
}

export const delteteAdminService = async(id: string): Promise<Admin | null> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    const result = await prisma.$transaction(async(transactionClient) => {
        const deletedAdmin = await transactionClient.admin.delete({
            where: {
                id
            }
        })

        await transactionClient.user.delete({
            where: {
                email: deletedAdmin.email
            }
        })

        return deletedAdmin;
    })

    return result;
}

export const softDelteteAdminService = async(id: string): Promise<Admin | null> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    const result = await prisma.$transaction(async(transactionClient) => {
        const deletedAdmin = await transactionClient.admin.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        })

        await transactionClient.user.update({
            where: {
                email: deletedAdmin.email
            },
            data: {
                status: UserStatus.DELETED
            }
        })

        return deletedAdmin;
    })

    return result;
}