import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";

const privateKey =
  "0x3951647f2037c9eb5e6e5c69b41a50694f5920336b2359f0baa19be1be0645e7";
const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.scrollSepolia,
  account: privateKeyToAccount(privateKey), // Optional, depending on environment
});

export const createNotaryAttestation = async () => {
  try {
    const res = await client.createAttestation({
      schemaId: "0x5c",
      data: {
        address: "0xd7f21235e67Cf4b9d51396998b830ae993270782",
        payload: "",
      },
      indexingValue: "1",
    });
    console.log("res", res);
  } catch (error: any) {
    console.log("error", error);
  }
};

// export const createNotaryAttestation = async (
//   attestationData: {
//     originSettler: string;
//     user: string;
//     nonce: string | number;
//     originChainId: string | number;
//     openDeadline: string | number;
//     fillDeadline: string | number;
//     orderDataType: string; // bytes32
//     orderData: string; // bytes
//   },
//   signer: string
// ) => {
//   try {
//     const rpcUrl = `https://scroll-sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;

//     const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
//     const privateKey = process.env.STRAW_PRIVATE_KEY || ""; // Use an environment variable
//     const wallet = new Wallet(privateKey, provider);
//     const contract = new Contract(
//       "0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD",
//       STRAW_ABI,
//       provider
//     );

//     const schemaData = ethers.utils.defaultAbiCoder.encode(
//       ["address", "uint256", "uint256"],
//       [attestationData.user, BigInt(0), BigInt(0)]
//     );

//     // Prepare attestation data
//     const attestation = {
//       schemaId: "0x60",
//       linkedAttestationId: 0, // No linked attestation
//       attestTimestamp: 0, // Auto-generated
//       revokeTimestamp: 0, // Not revoked
//       attester: wallet.address, // Attester address
//       validUntil: 0, // No expiry
//       dataLocation: 0, // On-chain data
//       revoked: false, // Not revoked
//       recipients: [wallet], // Recipient address
//       data: schemaData, // Encoded schema data
//     };

//     await contract[
//       "attest((uint64,uint64,uint64,uint64,address,uint64,uint8,bool,bytes[],bytes),string,bytes,bytes)"
//     ](
//       {
//         schemaId: BigNumber.from("0x60"), // The final number from our schema's ID.
//         linkedAttestationId: 0, // We are not linking an attestation.
//         attestTimestamp: 0, // Will be generated for us.
//         revokeTimestamp: 0, // Attestation is not revoked.
//         attester: wallet.address, // Alice's address.
//         validUntil: 0, // We are not setting an expiry date.
//         dataLocation: 0, // We are placing data on-chain.
//         revoked: false, // The attestation is not revoked.
//         recipients: [signer], // Bob is our recipient.
//         data: attestation, // The encoded schema data.
//       },
//       signer.toLowerCase(), // Bob's lowercase address will be our indexing key.
//       "0x", // No delegate signature.
//       "0x00" // No extra data.
//     )
//       .then(
//         async (tx: any) =>
//           await tx.wait(1).then((res: any) => {
//             console.log("success", res);
//             // You can find the attestation's ID using the following path:
//             // res.events[0].args.attestationId
//           })
//       )
//       .catch((err: any) => {
//         console.log(err?.message ? err.message : err);
//       });
//   } catch (err: any) {
//     console.log(err?.message ? err.message : err);
//   }
// };
