/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    StrawSettler: {
      address: "0x8ce361602b935680e8dec218b820ff5056beb7af",
      abi: [
        {
          type: "constructor",
          inputs: [
            {
              name: "_permit2",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "DEFAULT_ADMIN_ROLE",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "DOMAIN_SEPARATOR",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "ENS_ORDER_TYPE",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "ORACLE_ROLE",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "fill",
          inputs: [
            {
              name: "orderId",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "originData",
              type: "bytes",
              internalType: "bytes",
            },
            {
              name: "fillerData",
              type: "bytes",
              internalType: "bytes",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "getEncodedData",
          inputs: [
            {
              name: "tokenIn",
              type: "address",
              internalType: "address",
            },
            {
              name: "amountIn",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "label",
              type: "string",
              internalType: "string",
            },
            {
              name: "chainId",
              type: "uint64",
              internalType: "uint64",
            },
            {
              name: "registry",
              type: "address",
              internalType: "address",
            },
            {
              name: "recipient",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bytes",
              internalType: "bytes",
            },
          ],
          stateMutability: "pure",
        },
        {
          type: "function",
          name: "getRoleAdmin",
          inputs: [
            {
              name: "role",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "grantRole",
          inputs: [
            {
              name: "role",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "account",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "hasRole",
          inputs: [
            {
              name: "role",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "account",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "nonces",
          inputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "openFor",
          inputs: [
            {
              name: "order",
              type: "tuple",
              internalType: "struct IERC7683.GaslessCrossChainOrder",
              components: [
                {
                  name: "originSettler",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "user",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "nonce",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "originChainId",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "openDeadline",
                  type: "uint32",
                  internalType: "uint32",
                },
                {
                  name: "fillDeadline",
                  type: "uint32",
                  internalType: "uint32",
                },
                {
                  name: "orderDataType",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "orderData",
                  type: "bytes",
                  internalType: "bytes",
                },
              ],
            },
            {
              name: "signature",
              type: "bytes",
              internalType: "bytes",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "orderExists",
          inputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "orderResolved",
          inputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint8",
              internalType: "uint8",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "orderSettlement",
          inputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [
            {
              name: "user",
              type: "address",
              internalType: "address",
            },
            {
              name: "filler",
              type: "address",
              internalType: "address",
            },
            {
              name: "minReceive",
              type: "tuple",
              internalType: "struct IERC7683.Output",
              components: [
                {
                  name: "token",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "amount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "recipient",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "chainId",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
            {
              name: "orderSettled",
              type: "bool",
              internalType: "bool",
            },
            {
              name: "orderSuccessful",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "permit2",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "contract IPermit2",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "renounceRole",
          inputs: [
            {
              name: "role",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "callerConfirmation",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "resolveFor",
          inputs: [
            {
              name: "order",
              type: "tuple",
              internalType: "struct IERC7683.GaslessCrossChainOrder",
              components: [
                {
                  name: "originSettler",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "user",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "nonce",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "originChainId",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "openDeadline",
                  type: "uint32",
                  internalType: "uint32",
                },
                {
                  name: "fillDeadline",
                  type: "uint32",
                  internalType: "uint32",
                },
                {
                  name: "orderDataType",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "orderData",
                  type: "bytes",
                  internalType: "bytes",
                },
              ],
            },
            {
              name: "originFillerData",
              type: "bytes",
              internalType: "bytes",
            },
          ],
          outputs: [
            {
              name: "",
              type: "tuple",
              internalType: "struct IERC7683.ResolvedCrossChainOrder",
              components: [
                {
                  name: "user",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "originChainId",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "openDeadline",
                  type: "uint32",
                  internalType: "uint32",
                },
                {
                  name: "fillDeadline",
                  type: "uint32",
                  internalType: "uint32",
                },
                {
                  name: "orderId",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "maxSpent",
                  type: "tuple[]",
                  internalType: "struct IERC7683.Output[]",
                  components: [
                    {
                      name: "token",
                      type: "address",
                      internalType: "address",
                    },
                    {
                      name: "amount",
                      type: "uint256",
                      internalType: "uint256",
                    },
                    {
                      name: "recipient",
                      type: "bytes32",
                      internalType: "bytes32",
                    },
                    {
                      name: "chainId",
                      type: "uint256",
                      internalType: "uint256",
                    },
                  ],
                },
                {
                  name: "minReceived",
                  type: "tuple[]",
                  internalType: "struct IERC7683.Output[]",
                  components: [
                    {
                      name: "token",
                      type: "address",
                      internalType: "address",
                    },
                    {
                      name: "amount",
                      type: "uint256",
                      internalType: "uint256",
                    },
                    {
                      name: "recipient",
                      type: "bytes32",
                      internalType: "bytes32",
                    },
                    {
                      name: "chainId",
                      type: "uint256",
                      internalType: "uint256",
                    },
                  ],
                },
                {
                  name: "fillInstructions",
                  type: "tuple[]",
                  internalType: "struct IERC7683.FillInstruction[]",
                  components: [
                    {
                      name: "destinationChainId",
                      type: "uint64",
                      internalType: "uint64",
                    },
                    {
                      name: "destinationSettler",
                      type: "address",
                      internalType: "address",
                    },
                    {
                      name: "target",
                      type: "address",
                      internalType: "address",
                    },
                    {
                      name: "value",
                      type: "uint256",
                      internalType: "uint256",
                    },
                    {
                      name: "originData",
                      type: "bytes",
                      internalType: "bytes",
                    },
                  ],
                },
              ],
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "revokeRole",
          inputs: [
            {
              name: "role",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "account",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "settleForFulfiller",
          inputs: [
            {
              name: "orderHash",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "successfullyFulfilled",
              type: "bool",
              internalType: "bool",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "supportsInterface",
          inputs: [
            {
              name: "interfaceId",
              type: "bytes4",
              internalType: "bytes4",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "event",
          name: "Open",
          inputs: [
            {
              name: "orderId",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32",
            },
            {
              name: "resolvedOrder",
              type: "tuple",
              indexed: false,
              internalType: "struct IERC7683.ResolvedCrossChainOrder",
              components: [
                {
                  name: "user",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "originChainId",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "openDeadline",
                  type: "uint32",
                  internalType: "uint32",
                },
                {
                  name: "fillDeadline",
                  type: "uint32",
                  internalType: "uint32",
                },
                {
                  name: "orderId",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "maxSpent",
                  type: "tuple[]",
                  internalType: "struct IERC7683.Output[]",
                  components: [
                    {
                      name: "token",
                      type: "address",
                      internalType: "address",
                    },
                    {
                      name: "amount",
                      type: "uint256",
                      internalType: "uint256",
                    },
                    {
                      name: "recipient",
                      type: "bytes32",
                      internalType: "bytes32",
                    },
                    {
                      name: "chainId",
                      type: "uint256",
                      internalType: "uint256",
                    },
                  ],
                },
                {
                  name: "minReceived",
                  type: "tuple[]",
                  internalType: "struct IERC7683.Output[]",
                  components: [
                    {
                      name: "token",
                      type: "address",
                      internalType: "address",
                    },
                    {
                      name: "amount",
                      type: "uint256",
                      internalType: "uint256",
                    },
                    {
                      name: "recipient",
                      type: "bytes32",
                      internalType: "bytes32",
                    },
                    {
                      name: "chainId",
                      type: "uint256",
                      internalType: "uint256",
                    },
                  ],
                },
                {
                  name: "fillInstructions",
                  type: "tuple[]",
                  internalType: "struct IERC7683.FillInstruction[]",
                  components: [
                    {
                      name: "destinationChainId",
                      type: "uint64",
                      internalType: "uint64",
                    },
                    {
                      name: "destinationSettler",
                      type: "address",
                      internalType: "address",
                    },
                    {
                      name: "target",
                      type: "address",
                      internalType: "address",
                    },
                    {
                      name: "value",
                      type: "uint256",
                      internalType: "uint256",
                    },
                    {
                      name: "originData",
                      type: "bytes",
                      internalType: "bytes",
                    },
                  ],
                },
              ],
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "OrderFilled",
          inputs: [
            {
              name: "orderHash",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32",
            },
            {
              name: "fillData",
              type: "bytes",
              indexed: false,
              internalType: "bytes",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "OrderOpened",
          inputs: [
            {
              name: "orderHash",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32",
            },
            {
              name: "user",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "order",
              type: "tuple",
              indexed: false,
              internalType: "struct IERC7683.GaslessCrossChainOrder",
              components: [
                {
                  name: "originSettler",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "user",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "nonce",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "originChainId",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "openDeadline",
                  type: "uint32",
                  internalType: "uint32",
                },
                {
                  name: "fillDeadline",
                  type: "uint32",
                  internalType: "uint32",
                },
                {
                  name: "orderDataType",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "orderData",
                  type: "bytes",
                  internalType: "bytes",
                },
              ],
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "OrderResolved",
          inputs: [
            {
              name: "orderHash",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32",
            },
            {
              name: "resolvedOrder",
              type: "tuple",
              indexed: false,
              internalType: "struct IERC7683.ResolvedCrossChainOrder",
              components: [
                {
                  name: "user",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "originChainId",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "openDeadline",
                  type: "uint32",
                  internalType: "uint32",
                },
                {
                  name: "fillDeadline",
                  type: "uint32",
                  internalType: "uint32",
                },
                {
                  name: "orderId",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "maxSpent",
                  type: "tuple[]",
                  internalType: "struct IERC7683.Output[]",
                  components: [
                    {
                      name: "token",
                      type: "address",
                      internalType: "address",
                    },
                    {
                      name: "amount",
                      type: "uint256",
                      internalType: "uint256",
                    },
                    {
                      name: "recipient",
                      type: "bytes32",
                      internalType: "bytes32",
                    },
                    {
                      name: "chainId",
                      type: "uint256",
                      internalType: "uint256",
                    },
                  ],
                },
                {
                  name: "minReceived",
                  type: "tuple[]",
                  internalType: "struct IERC7683.Output[]",
                  components: [
                    {
                      name: "token",
                      type: "address",
                      internalType: "address",
                    },
                    {
                      name: "amount",
                      type: "uint256",
                      internalType: "uint256",
                    },
                    {
                      name: "recipient",
                      type: "bytes32",
                      internalType: "bytes32",
                    },
                    {
                      name: "chainId",
                      type: "uint256",
                      internalType: "uint256",
                    },
                  ],
                },
                {
                  name: "fillInstructions",
                  type: "tuple[]",
                  internalType: "struct IERC7683.FillInstruction[]",
                  components: [
                    {
                      name: "destinationChainId",
                      type: "uint64",
                      internalType: "uint64",
                    },
                    {
                      name: "destinationSettler",
                      type: "address",
                      internalType: "address",
                    },
                    {
                      name: "target",
                      type: "address",
                      internalType: "address",
                    },
                    {
                      name: "value",
                      type: "uint256",
                      internalType: "uint256",
                    },
                    {
                      name: "originData",
                      type: "bytes",
                      internalType: "bytes",
                    },
                  ],
                },
              ],
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "OrderSettled",
          inputs: [
            {
              name: "orderHash",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32",
            },
            {
              name: "successfullyFulfilled",
              type: "bool",
              indexed: false,
              internalType: "bool",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "RoleAdminChanged",
          inputs: [
            {
              name: "role",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32",
            },
            {
              name: "previousAdminRole",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32",
            },
            {
              name: "newAdminRole",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "RoleGranted",
          inputs: [
            {
              name: "role",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32",
            },
            {
              name: "account",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "sender",
              type: "address",
              indexed: true,
              internalType: "address",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "RoleRevoked",
          inputs: [
            {
              name: "role",
              type: "bytes32",
              indexed: true,
              internalType: "bytes32",
            },
            {
              name: "account",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "sender",
              type: "address",
              indexed: true,
              internalType: "address",
            },
          ],
          anonymous: false,
        },
        {
          type: "error",
          name: "AccessControlBadConfirmation",
          inputs: [],
        },
        {
          type: "error",
          name: "AccessControlUnauthorizedAccount",
          inputs: [
            {
              name: "account",
              type: "address",
              internalType: "address",
            },
            {
              name: "neededRole",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
        },
        {
          type: "error",
          name: "ECDSAInvalidSignature",
          inputs: [],
        },
        {
          type: "error",
          name: "ECDSAInvalidSignatureLength",
          inputs: [
            {
              name: "length",
              type: "uint256",
              internalType: "uint256",
            },
          ],
        },
        {
          type: "error",
          name: "ECDSAInvalidSignatureS",
          inputs: [
            {
              name: "s",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
        },
        {
          type: "error",
          name: "ReentrancyGuardReentrantCall",
          inputs: [],
        },
      ],
      inheritedFunctions: {},
    },
  },
  
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;