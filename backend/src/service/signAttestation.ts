import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";
import { IndexService } from "@ethsign/sp-sdk";

const privateKey = process.env.PROTOCOL_PRIVATE_KEY as `0x${string}`;
const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.sepolia,
  account: privateKeyToAccount(privateKey),
});

export const createNotaryAttestation = async (
  address: string,
  payload: string,
  requestId: string
) => {
  try {
    const response = await client.createAttestation({
      schemaId: process.env?.SIGN_SCHEMA_ID || "",
      data: {
        address,
        payload,
      },
      indexingValue: requestId,
    });
    return response;
  } catch (error: any) {
    return null;
  }
};

export const getAttestationData = async (requestId: string) => {
  try {
    const indexService = new IndexService("testnet");

    const res = await indexService.queryAttestationList({
      schemaId: process.env.SIGN_FULL_SCHEMA_ID,
      attester: "0x0c5A1cE8FF7eb7e140f6b606245F356f0D5ec40A",
      page: 1,
      mode: "onchain", // Data storage location
      indexingValue: requestId,
    });

    if (res) {
      return {
        success: true,
        attestations: res.rows,
      };
    } else {
      return {
        success: false,
        attestations: null,
      };
    }
  } catch (error: any) {
    console.log("error", error.message);
    return {
      success: false,
      attestations: null,
    };
  }
};
