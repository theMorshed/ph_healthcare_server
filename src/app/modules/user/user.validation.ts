import { Gender, UserStatus } from "@prisma/client";
import { z } from "zod";

export const adminSchema = z.object({
    password: z.string({required_error: 'Password is required'}),
    admin: z.object({
        name: z.string({required_error: 'Name is required'}),
        email: z.string({required_error: 'Email is required'}),
        contactNumber: z.string({required_error: 'Contact number is required'})
    })
});

// Enum for Gender
export const genderEnum = z.enum([Gender.MALE, Gender.FEMALE]);

// Doctor validation schema
export const doctorSchema = z.object({
    password: z.string({required_error: 'Password is required'}),
    doctor: z.object({
        name: z.string({ required_error: 'Name is required' }),
        email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
        profilePhoto: z.string().url('Invalid URL').optional(),
        contactNumber: z.string({ required_error: 'Contact number is required' }).min(10, 'Contact number must be at least 10 digits'),
        address: z.string().optional(),
        registrationNumber: z.string({ required_error: 'Registration number is required' }).min(1, 'Registration number is required'),
        experience: z.number().int().nonnegative().default(0),
        gender: genderEnum,
        appointmentFee: z.number({ required_error: 'Appointment fee is required' }).int().positive('Fee must be positive'),
        qualification: z.string({ required_error: 'Qualification is required' }),
        currentWorkingPlace: z.string({ required_error: 'Current working place is required' }),
        designation: z.string({ required_error: 'Designation is required' }),
        isDeleted: z.boolean().optional().default(false),
        averageRating: z.number({ required_error: 'Average rating is required' }).min(0).max(5),
    })
});

export const patientSchema = z.object({
    password: z.string({required_error: "Password is required"}),
    patient: z.object({
        name: z.string({ required_error: 'Name is required' }),
        email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
        profilePhoto: z.string().url('Invalid URL').optional(),
        contactNumber: z.string({ required_error: 'Contact number is required' }).min(10, 'Contact number must be at least 10 digits'),
        address: z.string().optional(),
        isDeleted: z.boolean().optional().default(false),
    })
});

export const statusSchema = z.object({
    body: z.object({
        status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED])
    })
})