import { Router } from "express";
import { deletePatient, getAllPatient, getPatientByID, softDeletePatient, updatePatientByID } from "./patient.controller";

const router = Router();

router.get('/', getAllPatient);
router.get('/:id', getPatientByID);
router.patch('/:id', updatePatientByID);
router.delete('/delete/:id', softDeletePatient);
router.delete('/:id', deletePatient);

export const patientRoutes = router;