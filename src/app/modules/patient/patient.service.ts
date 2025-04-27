import { Patient, Prisma, UserStatus } from "@prisma/client"
import { prisma } from "../../../shared/prisma";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { patientSearchableFields } from "./patient.constant";
import { TPatientUpdate } from "./patient.types";

export const getAllPatientService = async(params: any, options: any) => {    
    const { searchTerm, ...filterData } = params;
    const { limit, page, skip } = calculatePagination(options);
    const conditions: Prisma.PatientWhereInput[] = [];    

    if (params.searchTerm) {
        conditions.push({
            OR: patientSearchableFields.map(field => ({
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

    const whereConditons: Prisma.PatientWhereInput = {AND: conditions};

    const result = await prisma.patient.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        include: {
            medicalReport: true,
            patientHealthData: true
        }
    });

    const total = await prisma.patient.count({
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

export const getPatientByIDService = async(id: string): Promise<Patient | null> => {
    const result = await prisma.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        },
        include: {
            patientHealthData: true,
            medicalReport: true
        }
    });

    return result;
}

export const updatePatientByIDService = async(id: string, data: Partial<TPatientUpdate>): Promise<Patient | null> => {
    const { patientHealthData, medicalReport, ...patientData } = data;
    const patientInfo = await prisma.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    await prisma.$transaction(async(tc) => {
        // update patient update
        await tc.patient.update({
            where: {
                id
            },
            data: patientData,
            include: {
                patientHealthData: true,
                medicalReport: true
            }
        })

        // create or update patient data
        if (patientHealthData) {
            await tc.patientHealthData.upsert({
                where: {
                    patientId: patientInfo.id
                },
                update: patientHealthData,
                create: {
                    ...patientHealthData,
                    patientId: patientInfo.id
                }
            })
        }

        if (medicalReport) {
            await tc.medicalReport.create({
                data: {
                    ...medicalReport,
                    patientId: patientInfo.id
                }
            })
        }
    })

    const responseData = await prisma.patient.findUnique({
        where: {
            id: patientInfo.id
        },
        include: {
            patientHealthData: true,
            medicalReport: true
        }
    })

    return responseData;
}

export const deltetePatientService = async(id: string): Promise<Patient | null> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    const result = await prisma.$transaction(async(transactionClient) => {
        // delete medical report
        await transactionClient.medicalReport.deleteMany({
            where: {
                patientId: id
            }
        })

        // delete patient health data
        await transactionClient.patientHealthData.delete({
            where: {
                patientId: id
            }
        })

        const deletedPatient = await transactionClient.patient.delete({
            where: {
                id
            }
        })

        await transactionClient.user.delete({
            where: {
                email: deletedPatient.email
            }
        })

        return deletedPatient;
    })

    return result;
}

export const softDeltetePatientService = async(id: string): Promise<Patient | null> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    const result = await prisma.$transaction(async(transactionClient) => {
        const deletedPatient = await transactionClient.patient.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        })

        await transactionClient.user.update({
            where: {
                email: deletedPatient.email
            },
            data: {
                status: UserStatus.DELETED
            }
        })

        return deletedPatient;
    })

    return result;
}