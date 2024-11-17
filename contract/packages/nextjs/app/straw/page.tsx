"use client";

import { NextPage } from "next";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { anvil, scrollSepolia, sepolia } from "viem/chains";
import { useAccount, useWalletClient } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

// import { useState } from "react";
// import Image from "next/image";

const UserIndexPage: NextPage = () => {
  //   const [loader, setLoader] = useState<boolean>(true);

  const { address } = useAccount();

  const { data: walletClient } = useWalletClient();

  const { data: strawSettler } = useScaffoldContract({
    contractName: "StrawSettler",
    walletClient,
  });

  // Type definitions
  type SupportedChains = typeof scrollSepolia | typeof sepolia;
  type ContractWriteConfig = {
    abi: any[];
    address: `0x${string}`;
    functionName: string;
    args?: any[];
    chain: SupportedChains;
  };

  // Chain configuration

  // Initialize clients
  const getPublicClient = (chain: SupportedChains) => {
    return createPublicClient({
      chain,
      transport: http(),
    });
  };

  const getWalletClient = async (chain: SupportedChains) => {
    // Ensure window.ethereum exists
    if (!window.ethereum) {
      throw new Error("No ethereum provider found");
    }

    return createWalletClient({
      chain,
      transport: custom(window.ethereum),
    });
  };

  // Contract interaction function
  const writeContractDirectly = async ({ abi, address, functionName, args = [], chain }: ContractWriteConfig) => {
    try {
      const walletClient = await getWalletClient(chain);
      const publicClient = getPublicClient(chain);

      // Get the account
      const [account] = await walletClient.requestAddresses();

      // Simulate the transaction first
      const { request } = await publicClient.simulateContract({
        account,
        address,
        abi,
        functionName,
        args,
      });

      // Send the transaction
      const hash = await walletClient.writeContract(request);

      // Wait for transaction
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return { hash, receipt };
    } catch (error) {
      console.error("Contract write error:", error);
      throw error;
    }
  };

  const populateTransaction = async () => {
    if (strawSettler == null || strawSettler == undefined || address == undefined || walletClient == undefined) {
      return;
    }
    try {
      const timestamp = Math.round(Date.now() / 1000);

      const allowance = await writeContractDirectly({
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "token",
                type: "address",
              },
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint160",
                name: "amount",
                type: "uint160",
              },
              {
                internalType: "uint48",
                name: "expiration",
                type: "uint48",
              },
            ],
            name: "approve",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        address: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
        functionName: "allowance",
        chain: sepolia,
        args: [
          "0x533aDeb17c726c36AB8f2543F126021c437ee7dd",
          strawSettler.address,
          BigInt(10000000000000000),
          timestamp + 60 * 60,
        ],
      });

      console.log({ allowance });

      const labelName = "aabb";
      const tokenIn = "0x533aDeb17c726c36AB8f2543F126021c437ee7dd";
      const amountIn = "100000000";
      const registry = "0x5B7e697ED33a4666Be07eb0E3076C740604ca4DB";
      const destinationChain = "534351";

      const ensCallData: `0x${string}` = await strawSettler.read.getEncodedData([
        tokenIn,
        BigInt(amountIn),
        labelName,
        BigInt(destinationChain),
        registry,
        address,
      ]);

      const nonce: bigint = await strawSettler.read.nonces([address]);
      const dataType = await strawSettler.read.ENS_ORDER_TYPE();

      const signature = await walletClient.signTypedData({
        account: address,
        domain: {
          name: "StrawSettler",
          version: "1",
          chainId: anvil.id,
          verifyingContract: strawSettler.address,
        },
        types: {
          GaslessCrossChainOrder: [
            { name: "originSettler", type: "address" },
            { name: "user", type: "address" },
            { name: "nonce", type: "uint256" },
            { name: "originChainId", type: "uint256" },
            { name: "openDeadline", type: "uint32" },
            { name: "fillDeadline", type: "uint32" },
            { name: "orderDataType", type: "bytes32" },
            { name: "orderData", type: "bytes" },
          ],
        },
        primaryType: "GaslessCrossChainOrder",
        message: {
          originSettler: strawSettler.address,
          openDeadline: timestamp,
          fillDeadline: timestamp + 10 * 60,
          nonce: nonce,
          originChainId: BigInt(destinationChain),
          user: address,
          orderDataType: dataType,
          orderData: ensCallData,
        },
      });

      console.log({ signature });

      strawSettler.write.openFor([
        {
          originSettler: strawSettler.address,
          user: address,
          nonce: BigInt(195798564),
          originChainId: BigInt(sepolia.id),
          openDeadline: timestamp,
          fillDeadline: timestamp + 10 * 60,
          orderData: signature,
          orderDataType: dataType,
        },
        signature,
      ]);

      //   const ensData =
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="container mx-auto ">
        <div className="flex flex-col justify-center">
          <div>
            <div className="hero min-h-screen bg-base-200">
              <div className="hero-content text-center">
                <div className="max-w-lg">
                  <div id="opening">
                    <h1 className="text-5xl font-bold">Straw Protocol</h1>
                    <button
                      className="btn btn-primary mt-10"
                      type="button"
                      onClick={() => {
                        populateTransaction();
                      }}
                    >
                      Sip On!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="max-h-[40vh]"></div>
          {/* {loader && <FullPageLoader />} */}
        </div>
      </div>
    </>
  );
};

export default UserIndexPage;
