// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IMessageBridge {
    /// @notice Emitted when a cross-chain message is sent
    event MessageSent(
        uint256 indexed destinationChainId,
        address indexed sender,
        bytes message,
        bytes metadata
    );

    /// @notice Emitted when a cross-chain message is received
    event MessageReceived(
        uint256 indexed sourceChainId,
        address indexed sender,
        bytes message,
        bytes metadata
    );

    /// @notice Sends a message to the destination chain
    /// @param destinationChainId The chain ID of the destination chain
    /// @param message The message to be sent
    /// @param metadata Additional metadata for the message delivery
    /// @return messageId The unique identifier for this message
    function sendMessage(
        uint256 destinationChainId,
        bytes calldata message,
        bytes calldata metadata
    ) external payable returns (bytes32 messageId);

    /// @notice Verifies if a message is valid and was properly received
    /// @param messageId The ID of the message to verify
    /// @return valid Whether the message is valid
    function isValidMessage(bytes32 messageId) external view returns (bool valid);

    /// @notice Returns the status of a message
    /// @param messageId The ID of the message to check
    /// @return status The status of the message (0: Unknown, 1: Pending, 2: Delivered, 3: Failed)
    function messageStatus(bytes32 messageId) external view returns (uint8 status);

    /// @notice Returns the estimated fee for sending a message
    /// @param destinationChainId The target chain ID
    /// @param message The message to be sent
    /// @param metadata Additional metadata
    /// @return fee The estimated fee in native tokens
    function estimateFee(
        uint256 destinationChainId,
        bytes calldata message,
        bytes calldata metadata
    ) external view returns (uint256 fee);
}