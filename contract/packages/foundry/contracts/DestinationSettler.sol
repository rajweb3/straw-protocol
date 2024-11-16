// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IDestinationSettler.sol";
import "./interfaces/IMessageBridge.sol";

contract DestinationSettler is IDestinationSettler, Ownable, ReentrancyGuard {
    // IMessageBridge public messageBridge;
    mapping(bytes32 => bool) public executedOrders;

    constructor(address _messageBridge) Ownable(msg.sender) {
        // messageBridge = IMessageBridge(_messageBridge);
    }

    function fill(
        bytes32 orderHash,
        bytes calldata executionData
    ) external override nonReentrant {
        require(!executedOrders[orderHash], "Order already executed");
        // require(messageBridge.isValidMessage(orderHash), "Invalid message");
        
        // Execute the cross-chain interaction
        _executeInteraction(orderHash, executionData);
        
        // Mark order as executed
        executedOrders[orderHash] = true;
        
        emit OrderFilled(orderHash, msg.sender, executionData);
    }

    function _executeInteraction(
        bytes32 orderHash,
        bytes memory executionData
    ) internal {
        // Decode execution data
        (address target, bytes memory data) = abi.decode(
            executionData,
            (address, bytes)
        );
        
        // Execute the interaction
        (bool success, bytes memory result) = target.call(data);
        require(success, "Execution failed");
        
        emit InteractionExecuted(orderHash, target, result);
    }
}