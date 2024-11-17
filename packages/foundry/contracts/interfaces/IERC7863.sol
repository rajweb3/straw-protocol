// src/interfaces/IERC7683.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC7683 {
    // Core structs as per spec

    // Example for ENS Registration
    struct EnsData {
        address tokenIn;
        uint256 amountIn;
        string label;
        uint64 chainId;
        address registry;
        address recipient;
    }

    struct EnsFillData {
        string label;
        address owner;
    }

    /// @title GaslessCrossChainOrder CrossChainOrder type
    /// @notice Standard order struct to be signed by users, disseminated to fillers, and submitted to origin settler contracts
    struct GaslessCrossChainOrder {
        /// @dev The contract address that the order is meant to be settled by.
        /// Fillers send this order to this contract address on the origin chain
        address originSettler;
        /// @dev The address of the user who is initiating the swap,
        /// whose input tokens will be taken and escrowed
        address user;
        /// @dev Nonce to be used as replay protection for the order
        uint256 nonce;
        /// @dev The chainId of the origin chain
        uint256 originChainId;
        /// @dev The timestamp by which the order must be opened
        uint32 openDeadline;
        /// @dev The timestamp by which the order must be filled on the destination chain
        uint32 fillDeadline;
        /// @dev Type identifier for the order data. This is an EIP-712 typehash.
        bytes32 orderDataType;
        /// @dev Arbitrary implementation-specific data
        /// Can be used to define tokens, amounts, destination chains, fees, settlement parameters,
        /// or any other order-type specific information
        bytes orderData;
    }

    /// @title ResolvedCrossChainOrder type
    /// @notice An implementation-generic representation of an order intended for filler consumption
    /// @dev Defines all requirements for filling an order by unbundling the implementation-specific orderData.
    /// @dev Intended to improve integration generalization by allowing fillers to compute the exact input and output information of any order
    struct ResolvedCrossChainOrder {
        /// @dev The address of the user who is initiating the transfer
        address user;
        /// @dev The chainId of the origin chain
        uint256 originChainId;
        /// @dev The timestamp by which the order must be opened
        uint32 openDeadline;
        /// @dev The timestamp by which the order must be filled on the destination chain(s)
        uint32 fillDeadline;
        /// @dev The unique identifier for this order within this settlement system
        bytes32 orderId;
        /// @dev The max outputs that the filler will send. It's possible the actual amount depends on the state of the destination
        ///      chain (destination dutch auction, for instance), so these outputs should be considered a cap on filler liabilities.
        Output[] maxSpent;
        /// @dev The minimum outputs that must be given to the filler as part of order settlement. Similar to maxSpent, it's possible
        ///      that special order types may not be able to guarantee the exact amount at open time, so this should be considered
        ///      a floor on filler receipts.
        Output[] minReceived; // not empty
        /// @dev Each instruction in this array is parameterizes a single leg of the fill. This provides the filler with the information
        ///      necessary to perform the fill on the destination(s).
        FillInstruction[] fillInstructions;
    }

    /// @notice Tokens that must be received for a valid order fulfillment
    struct Output {
        /// @dev The address of the ERC20 token on the destination chain
        /// @dev address(0) used as a sentinel for the native token
        address token;
        /// @dev The amount of the token to be sent
        uint256 amount;
        /// @dev The address to receive the output tokens
        bytes32 recipient;
        /// @dev The destination chain for this output
        uint256 chainId;
    }

    /// @title FillInstruction type
    /// @notice Instructions to parameterize each leg of the fill
    /// @dev Provides all the origin-generated information required to produce a valid fill leg
    struct FillInstruction {
        /// @dev The contract address that the order is meant to be settled by
        uint64 destinationChainId;
        /// @dev The contract address that the order is meant to be filled on
        address destinationSettler;
        /// @dev The contract address that the order is meant to invoke
        address target;
        /// @dev The value to be sent through for fulfilling the invocation
        uint256 value;
        /// @dev The data generated on the origin chain needed by the destinationSettler to process the fill
        bytes originData;
    }

    struct OrderStake {
        address user;
        address filler;
        Output minReceive;
        bool orderSettled;
        bool orderSuccessful;
    }

    // Events as per spec

    /// @notice Signals that an order has been opened
    /// @param orderId a unique order identifier within this settlement system
    /// @param resolvedOrder resolved order that would be returned by resolve if called instead of Open
    event Open(bytes32 indexed orderId, ResolvedCrossChainOrder resolvedOrder);

    event OrderOpened(
        bytes32 indexed orderHash,
        address indexed user,
        GaslessCrossChainOrder order
    );

    event OrderResolved(
        bytes32 indexed orderHash,
        ResolvedCrossChainOrder resolvedOrder
    );

    event OrderFilled(bytes32 indexed orderHash, bytes fillData);

    event OrderSettled(bytes32 indexed orderHash, bool successfullyFulfilled);


    // Core functions as per spec

    /// @notice Opens a gasless cross-chain order on behalf of a user.
    /// @dev To be called by the filler.
    /// @dev This method must emit the Open event
    /// @param order The GaslessCrossChainOrder definition
    /// @param signature The user's signature over the order
    function openFor(
        GaslessCrossChainOrder calldata order,
        bytes calldata signature
    ) external returns (bytes32 orderHash);

    /// @notice Resolves a specific GaslessCrossChainOrder into a generic ResolvedCrossChainOrder
    /// @dev Intended to improve standardized integration of various order types and settlement contracts
    /// @param order The GaslessCrossChainOrder definition
    /// @param originFillerData Any filler-defined data required by the settler
    /// @return ResolvedCrossChainOrder hydrated order data including the inputs and outputs of the order
    function resolveFor(
        GaslessCrossChainOrder calldata order,
        bytes calldata originFillerData
    ) external view returns (ResolvedCrossChainOrder memory);

    /// @notice Fills a single leg of a particular order on the destination chain
    /// @param orderId Unique order identifier for this order
    /// @param originData Data emitted on the origin to parameterize the fill
    /// @param fillerData Data provided by the filler to inform the fill or express their preferences
    function fill(
        bytes32 orderId,
        bytes calldata originData,
        bytes calldata fillerData
    ) external;
}
