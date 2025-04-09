import { Prisma, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const getAllAdminService = async(params: any) => {    
    const { searchTerm, ...filterData } = params;
    const conditions: Prisma.AdminWhereInput[] = [];
    const searchableFields = ['name', 'email'];

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
        where: whereConditons
    });

    return result;
}