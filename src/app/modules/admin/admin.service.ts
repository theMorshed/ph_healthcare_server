import { Prisma } from "@prisma/client"
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

    return result;
}