import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";
import { LitNetwork } from "@lit-protocol/constants";
import { LocalStorage } from "node-localstorage";
import { LIT_RPC } from "@lit-protocol/constants";
import * as ethers from "ethers";
import {
  LitAbility,
  LitAccessControlConditionResource,
  createSiweMessage,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";

class Lit {
  private litNodeClient: LitJsSdk.LitNodeClientNodeJs | undefined;
  private chain: string;

  constructor(chain: string) {
    this.chain = chain;
  }

  async connect(): Promise<any> {
    try {
      this.litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
        alertWhenUnauthorized: false,
        litNetwork: LitNetwork.DatilDev, // Use "datil-dev" from constants
        debug: true,
        storageProvider: {
          provider: new LocalStorage("./lit_storage.db"),
        },
      });

      console.log("Connecting to the Lit Network...");
      await this.litNodeClient.connect();

      console.log("Successfully connected to the Lit Network!");
    } catch (error) {
      console.error("Failed to connect to the Lit Network:", error);
      throw error;
    }
  }

  getClient(): LitJsSdk.LitNodeClientNodeJs | undefined {
    if (!this.litNodeClient) {
      console.warn("LitNodeClient is not initialized. Call `connect()` first.");
    }
    return this.litNodeClient;
  }

  private ensureClient(): LitJsSdk.LitNodeClientNodeJs {
    if (!this.litNodeClient) {
      throw new Error(
        "Lit Protocol Client is not initialized. Did you call `connect`?"
      );
    }
    return this.litNodeClient;
  }

  async encryptData(
    dataToEncrypt: string,
    accessControlConditions: any[]
  ): Promise<{
    ciphertext: string;
    dataToEncryptHash: string;
    sessionSigs: any;
  }> {
    const litNodeClient = this.ensureClient();
    const sessionSigs = litNodeClient.getSessionKey();
    if (!sessionSigs) {
      throw new Error("Failed to get session signatures.");
    }

    const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
      {
        accessControlConditions,
        dataToEncrypt,
      },
      litNodeClient
    );
    return { ciphertext, dataToEncryptHash, sessionSigs };
  }

  async dycriptData(
    ciphertext: string,
    dataToEncryptHash: string,
    accessControlConditions: any,
    sessionSigs: any
  ): Promise<any> {
    const litNodeClient = this.ensureClient();

    const decryptedData = await LitJsSdk.decryptToString(
      {
        sessionSigs: sessionSigs,
        ciphertext,
        dataToEncryptHash,
        chain: "ethereum",
        accessControlConditions,
      },
      litNodeClient
    );
    return JSON.parse(decryptedData);
  }

  async getSessionSigs() {
    const litNodeClient = this.ensureClient();

    const sessionSignatures = await litNodeClient.getSessionSigs({
      chain: "ethereum",
      expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
      resourceAbilityRequests: [
        {
          resource: new LitAccessControlConditionResource("*"),
          ability: LitAbility.AccessControlConditionDecryption,
        },
      ],
      authNeededCallback: async ({
        uri,
        expiration,
        resourceAbilityRequests,
      }) => {
        const ethersSigner = new ethers.Wallet(
          process.env.STRAW_PRIVATE_KEY || "",
          new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
        );

        const toSign = await createSiweMessage({
          uri,
          expiration,
          resources: resourceAbilityRequests,
          walletAddress: ethersSigner.address,
          nonce: await litNodeClient.getLatestBlockhash(),
          litNodeClient,
        });
        return await generateAuthSig({
          signer: ethersSigner,
          toSign,
        });
      },
    });

    return sessionSignatures;
  }
}

export default Lit;
