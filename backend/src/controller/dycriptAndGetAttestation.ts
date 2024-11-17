import { Request, Response } from "express";
import { internalServerError } from "../config/commonResponse";
import { serviceDycriptAndGetAttestation } from "../service/dycriptAndGetAttestation";

export const dycriptAndGetAttestation = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    return await serviceDycriptAndGetAttestation(req, res);
  } catch (error: any) {
    return internalServerError(res, error);
  }
};
