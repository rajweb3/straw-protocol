import { Request, Response } from "express";
import { internalServerError } from "../config/commonResponse";
import { serviceEncryptAndGenerateAttestation } from "../service/encryptAndGenerateAttestation";

export const encryptAndGenerateAttestation = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    return await serviceEncryptAndGenerateAttestation(req, res);
  } catch (error: any) {
    return internalServerError(res, error);
  }
};
