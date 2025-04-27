import { Admin, Doctor, Prisma, UserStatus } from "@prisma/client"
import { prisma } from "../../../shared/prisma";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { searchableFields } from "./doctor.constant";

export const getAllDoctorService = async(params: any, options: any) => {    
    const { searchTerm, ...filterData } = params;
    const { limit, page, skip } = calculatePagination(options);
    const conditions: Prisma.DoctorWhereInput[] = [];    

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

    const whereConditons: Prisma.DoctorWhereInput = {AND: conditions};

    const result = await prisma.doctor.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
    });

    const total = await prisma.doctor.count({
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

export const getDoctorByIDService = async(id: string): Promise<Doctor | null> => {
    const result = await prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
    });

    return result;
}

export const updateDoctorService = async(id: string, data: any): Promise<Doctor | null> => {
    const { specialties, ...doctorData } = data;
    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    await prisma.$transaction(async(transactionClient) => {
        await prisma.doctor.update({
            where: {
                id
            },
            data: doctorData
        });        
        if (specialties && specialties.length > 0) {
            const deleteSpecialtiesIds = specialties.filter((specialty: any) => specialty.isDelete);
            for (const specialty of deleteSpecialtiesIds) {
                await transactionClient.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: doctorInfo.id,
                        specialtiesId: specialty.specialtiesId
                    }
                })
            }

            const addSpecialtiesIds = specialties.filter((specialty: any) => !specialty.isDelete);
            for (const specialty of addSpecialtiesIds) {
                await transactionClient.doctorSpecialties.create({
                    data: {
                        doctorId: doctorInfo.id,
                        specialtiesId: specialty.specialtiesId
                    }
                })
            }
        }
    })

    const result = await prisma.doctor.findUnique({
        where: {
            id: doctorInfo.id
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
    })

    return result;
}

export const delteteDoctorService = async(id: string): Promise<Doctor | null> => {
    await prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    const result = await prisma.$transaction(async(transactionClient) => {
        const deletedDoctor = await transactionClient.doctor.delete({
            where: {
                id
            }
        })

        await transactionClient.user.delete({
            where: {
                email: deletedDoctor.email
            }
        })

        return deletedDoctor;
    })

    return result;
}

export const softDelteteDoctorService = async(id: string): Promise<Doctor | null> => {
    await prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    const result = await prisma.$transaction(async(transactionClient) => {
        const deletedDoctor = await transactionClient.doctor.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        })

        await transactionClient.user.update({
            where: {
                email: deletedDoctor.email
            },
            data: {
                status: UserStatus.DELETED
            }
        })

        return deletedDoctor;
    })

    return result;
}