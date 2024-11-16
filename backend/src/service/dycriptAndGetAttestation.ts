import { Request, Response } from "express";
import Lit from "./Lit";
import { getRedisValue } from "../config/redisConfig";
import {
  internalServerError,
  requestFailed,
  responseSuccess,
} from "../config/commonResponse";
import httpStatus from "../config/httpStatus";
import { getAttestationData } from "./signAttestation";

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

export const serviceDycriptAndGetAttestation = async (
  req: Request,
  res: Response
) => {
  try {
    const { requestId } = req.body;
    const chain = "ethereum";
    const lit = new Lit(chain);
    await lit.connect();

    const signSessionResponse = await getRedisValue(requestId);
    if (!signSessionResponse) {
      return requestFailed(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        "Could not fetch the relevant data, try again in sometime."
      );
    }
    const signSession = JSON.parse(signSessionResponse);

    const attestationResponse = await getAttestationData(requestId);
    if (!attestationResponse.attestations) {
      return responseSuccess(
        res,
        httpStatus.NOT_FOUND,
        null,
        "No Attestation found for request id."
      );
    }

    const decoded = Buffer.from(signSession.ciphertext, "base64");
    // Truncate to 32 bytes
    const truncated = decoded.slice(0, 32);
    // Convert to Solidity-compatible hex format
    const solidityBytes32 = "0x" + truncated.toString("hex");

    const strippedData = attestationResponse.attestations[0].data;
    const strippedSolidityBytes32 = solidityBytes32.slice(2);

    // Check if solidityBytes32 exists in data
    const exists = strippedData.includes(strippedSolidityBytes32);
    if (!exists) {
      return responseSuccess(
        res,
        httpStatus.UNAUTHORIZED,
        null,
        "Attestation does not match."
      );
    }

    const dycriptDataResponse = await lit.dycriptData(
      signSession.ciphertext,
      signSession.dataToEncryptHash,
      accessControlConditions,
      signSession.signSession
    );

    return responseSuccess(
      res,
      httpStatus.OK,
      dycriptDataResponse,
      "Data Attestation completed succesfully."
    );
  } catch (error: any) {
    console.log("error:", error.message);
    return internalServerError(res, error.message);
  }
};
