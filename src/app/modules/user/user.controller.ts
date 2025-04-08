import { Request, Response } from "express";
import { createAdminService } from "./user.service";

export const createAdmin = async(req: Request, res: Response) => {
    const result = await createAdminService(req.body);
    res.send(result);
}