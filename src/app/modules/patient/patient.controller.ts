import { pick } from "../../../shared/pick";
import { sendResponse } from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../shared/catchAsync";
import { patientFilterableFields } from "./patient.constant";
import { deltetePatientService, getAllPatientService, getPatientByIDService, softDeltetePatientService, updatePatientByIDService } from "./patient.service";

export const getAllPatient = catchAsync(async(req, res) => {
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, ['limit', 'page']);   
    const result = await getAllPatientService(filters, options);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'All patient retrieved successfully',
        meta: result.meta,
        data: result.data
    })    
})

export const getPatientByID = catchAsync(async(req, res) => {
    const { id } = req.params;
    
    const result = await getPatientByIDService(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patient retrieved successfully',
        data: result
    })       
})

export const updatePatientByID = catchAsync(async(req, res) => {
    const { id } = req.params;
    
    const result = await updatePatientByIDService(id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patient updated successfully',
        data: result
    })          
  
})

export const deletePatient = catchAsync(async(req, res) => {
    const { id } = req.params;
    
    const result = await deltetePatientService(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patient deleted successfully',
        data: result
    })         
})

export const softDeletePatient = catchAsync(async(req, res) => {
    const { id } = req.params;
    
    const result = await softDeltetePatientService(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Patient soft deleted successfully',
        data: result
    })         
})