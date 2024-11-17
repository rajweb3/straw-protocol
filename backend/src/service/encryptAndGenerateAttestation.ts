import { Request, Response } from "express";
import { responseSuccess, internalServerError } from "../config/commonResponse";
import httpStatus from "../config/httpStatus";
import Lit from "./Lit";
import { setRedisValue } from "../config/redisConfig";
import { createNotaryAttestation } from "./signAttestation";

const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain: "ethereum",
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "0", // 0.000001 ETH
    },
  },
];

export const serviceEncryptAndGenerateAttestation = async (
  req: Request,
  res: Response
) => {
  try {
    const { address, payload, requestId } = req.body;
    const chain = "ethereum";
    const lit = new Lit(chain);
    await lit.connect();
    const signSession = await lit.getSessionSigs();

    const encryptDataResponse = await lit.encryptData(
      JSON.stringify(payload),
      accessControlConditions
    );

    await setRedisValue(
      requestId,
      JSON.stringify({ signSession, ...encryptDataResponse })
    );

    const decoded = Buffer.from(encryptDataResponse.ciphertext, "base64");

    // Truncate to 32 bytes
    const truncated = decoded.slice(0, 32);

    // Convert to Solidity-compatible hex format
    const solidityBytes32 = "0x" + truncated.toString("hex");

    await createNotaryAttestation(address, solidityBytes32, requestId);

    return responseSuccess(
      res,
      httpStatus.OK,
      null,
      "Data Attestation completed succesfully."
    );
  } catch (error: any) {
    console.log(error);
    return internalServerError(res, error.message);
  }
};
