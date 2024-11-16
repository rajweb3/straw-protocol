import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";

const privateKey = process.env.PROTOCOL_PRIVATE_KEY as `0x${string}`;
const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.sepolia,
  account: privateKeyToAccount(privateKey), // Optional, depending on environment
});

export const createNotaryAttestation = async (
  address: string,
  payload: string,
  requestId: string
) => {
  try {
    const response = await client.createAttestation({
      schemaId: "0x314",
      data: {
        address,
        payload,
      },
      indexingValue: requestId,
    });
    return response;
  } catch (error: any) {
    console.log("error", error.message);
  }
};
