// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IOriginSettler {
    struct GaslessCrossChainOrder {
        address originSettler;
        address user;
        uint256 nonce;
        uint256 originChainId;
        uint32 openDeadline;
        uint32 fillDeadline;
        bytes32 orderDataType;
        bytes orderData;
    }

    struct OnchainCrossChainOrder {
        uint32 fillDeadline;
        bytes32 orderDataType;
        bytes orderData;
    }

    struct ResolvedCrossChainOrder {
        bytes32 orderHash;
        bytes resolvedData;
        address resolver;
        uint256 timestamp;
    }

    event OrderOpened(
        bytes32 indexed orderHash,
        address indexed user,
        GaslessCrossChainOrder order
    );

    event OnchainOrderOpened(
        bytes32 indexed orderHash,
        address indexed user,
        OnchainCrossChainOrder order
    );

    event OrderResolved(
        bytes32 indexed orderHash,
        ResolvedCrossChainOrder resolvedOrder
    );

    function openFor(
        GaslessCrossChainOrder calldata order,
        bytes calldata signature
    ) external returns (bytes32);

    function open(
        OnchainCrossChainOrder calldata order
    ) external returns (bytes32);

    function resolve(
        bytes32 orderHash,
        bytes calldata resolutionData
    ) external returns (ResolvedCrossChainOrder memory);
}