// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IDestinationSettler {
    event OrderFilled(
        bytes32 indexed orderHash,
        address indexed filler,
        bytes executionData
    );

    event InteractionExecuted(
        bytes32 indexed orderHash,
        address indexed target,
        bytes result
    );

    function fill(
        bytes32 orderHash,
        bytes calldata executionData
    ) external;
}