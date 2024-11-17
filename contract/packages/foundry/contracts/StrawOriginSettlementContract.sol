
// src/OriginSettler.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IOriginSettler.sol";
import "./interfaces/IMessageBridge.sol";

contract OriginSettler is IOriginSettler, Ownable, ReentrancyGuard {
    // State variables
    mapping(bytes32 => OrderStatus) public orderStatus;
    mapping(address => uint256) public nonces;
    // IMessageBridge public messageBridge;
    
    struct OrderStatus {
        bool isOpen;
        bool isExecuted;
        uint256 timestamp;
    }

    constructor(address _messageBridge) Ownable(msg.sender) {
        // messageBridge = IMessageBridge(_messageBridge);
    }

    function openFor(
        GaslessCrossChainOrder calldata order,
        bytes calldata signature
        // bytes calldata originFillerData
    ) external override nonReentrant returns (bytes32) {
        bytes32 orderHash = _hashOrder(order);
        require(!orderStatus[orderHash].isOpen, "Order already open");
        require(block.timestamp <= order.openDeadline, "Order expired");
        
        // Verify signature
        require(_verifySignature(order, signature), "Invalid signature");
        
        // Update state
        orderStatus[orderHash] = OrderStatus({
            isOpen: true,
            isExecuted: false,
            timestamp: block.timestamp
        });
        
        nonces[order.user]++;
        
        emit OrderOpened(orderHash, order.user, order);
        return orderHash;
    }

    function open(
        OnchainCrossChainOrder calldata order
    ) external override nonReentrant returns (bytes32) {
        bytes32 orderHash = _hashOnchainOrder(order, msg.sender);
        require(!orderStatus[orderHash].isOpen, "Order already open");
        
        // Update state
        orderStatus[orderHash] = OrderStatus({
            isOpen: true,
            isExecuted: false,
            timestamp: block.timestamp
        });
        
        emit OnchainOrderOpened(orderHash, msg.sender, order);
        return orderHash;
    }

    function resolve(
        bytes32 orderHash,
        bytes calldata resolutionData
    ) external override returns (ResolvedCrossChainOrder memory) {
        require(orderStatus[orderHash].isOpen, "Order not open");
        require(!orderStatus[orderHash].isExecuted, "Order already executed");
        
        // Parse resolution data and create resolved order
        ResolvedCrossChainOrder memory resolvedOrder = _resolveOrder(
            orderHash,
            resolutionData
        );
        
        // Mark order as executed
        orderStatus[orderHash].isExecuted = true;
        
        // Send message to destination chain
        // _sendCrossChainMessage(resolvedOrder);
        
        emit OrderResolved(orderHash, resolvedOrder);
        return resolvedOrder;
    }

    // Internal functions
    function _hashOrder(
        GaslessCrossChainOrder memory order
    ) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            order.originSettler,
            order.user,
            order.nonce,
            order.originChainId,
            order.openDeadline,
            order.fillDeadline,
            order.orderDataType,
            order.orderData
        ));
    }

    function _hashOnchainOrder(
        OnchainCrossChainOrder memory order,
        address sender
    ) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            sender,
            order.fillDeadline,
            order.orderDataType,
            order.orderData
        ));
    }

    function _verifySignature(
        GaslessCrossChainOrder memory order,
        bytes memory signature
    ) internal pure returns (bool) {
        bytes32 orderHash = _hashOrder(order);
        bytes32 messageHash = keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            orderHash
        ));
        
        // Recover signer
        (bytes32 r, bytes32 s, uint8 v) = _splitSignature(signature);
        address recovered = ecrecover(messageHash, v, r, s);
        
        return recovered == order.user;
    }

    function _splitSignature(
        bytes memory signature
    ) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(signature.length == 65, "Invalid signature length");
        
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
    }

    function _resolveOrder(
        bytes32 orderHash,
        bytes memory resolutionData
    ) internal view returns (ResolvedCrossChainOrder memory) {
        // Implement resolution logic based on your requirements
        // This could include decoding specific parameters, validating conditions, etc.
        
        // For now, returning a basic structure
        return ResolvedCrossChainOrder({
            orderHash: orderHash,
            resolvedData: resolutionData,
            resolver: msg.sender,
            timestamp: block.timestamp
        });
    }

    // function _sendCrossChainMessage(
    //     ResolvedCrossChainOrder memory resolvedOrder
    // ) internal {
    //     bytes memory message = abi.encode(resolvedOrder);
    //     messageBridge.sendMessage(message);
    // }
}