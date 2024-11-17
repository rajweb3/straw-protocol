// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IERC7863.sol";
import "./interfaces/Permit2/IPermit2.sol";
import "./interfaces/Permit2/ISignatureTransfer.sol";

contract StrawSettler is IERC7683, ReentrancyGuard, AccessControl {
    using ECDSA for bytes32;

    // Constants
    mapping(bytes32 => uint8) public orderResolved; // destination settler
    
    bytes32 public constant ENS_ORDER_TYPE = keccak256("ENS_REGISTRATION_V1");
    bytes32 public constant ORACLE_ROLE = keccak256("TRUSTED_ORACLE_ROLE");
    bytes32 public immutable DOMAIN_SEPARATOR;

    // State variables
    IPermit2 public immutable permit2;

    mapping(bytes32 => bool) public orderExists; // origin settler
    mapping(bytes32 => OrderStake) public orderSettlement; // settling the opened orders
    mapping(address => uint256) public nonces;

    constructor(address _permit2) {
        permit2 = IPermit2(_permit2);
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256("StrawSettler"),
                keccak256("1"),
                block.chainid,
                address(this)
            )
        );
    }

    function openFor(
        GaslessCrossChainOrder calldata order,
        bytes calldata signature
    ) external nonReentrant returns (bytes32) {
        require(
            order.originSettler == address(this),
            "Inovked incorrect settler"
        );
        require(order.originChainId == block.chainid, "Incorrect chain id");
        require(block.timestamp <= order.openDeadline, "Order expired");
        require(order.user != address(0), "Invalid user");
        require(order.nonce == nonces[order.user], "Invalid nonce");

        bytes32 orderHash = _hashOrder(order);
        require(!orderExists[orderHash], "Order already exists");

        // Verify signature
        require(_verifySignature(order, signature), "Invalid signature");

        /// Decode ENS order data
        EnsData memory ensData = abi.decode(order.orderData, (EnsData));

        // Validate ENS data
        require(bytes(ensData.label).length > 0, "Invalid ENS label");
        require(ensData.recipient != address(0), "Invalid recipient");
        require(ensData.tokenIn != address(0), "Invalid token");
        require(ensData.amountIn > 0, "Invalid amount");

        // Transfer tokens using Permit2
        _handlePermit2Transfer(
            order.user,
            ensData.tokenIn,
            ensData.amountIn,
            signature
        );

        orderSettlement[orderHash] = OrderStake({
            user: order.user,
            filler: msg.sender,
            orderSettled: false,
            orderSuccessful: false,
            minReceive: Output({
                token: ensData.tokenIn,
                amount: ensData.amountIn,
                recipient: bytes32(uint256(uint160(msg.sender))),
                chainId: order.originChainId
            })
        });
        orderExists[orderHash] = true;
        nonces[order.user]++;

        emit OrderOpened(orderHash, order.user, order);
        return orderHash;
    }

    function resolveFor(
        GaslessCrossChainOrder calldata order,
        bytes memory originFillerData
    ) external view returns (ResolvedCrossChainOrder memory) {
        EnsData memory ensData = abi.decode(order.orderData, (EnsData));

        Output[] memory maxSpent = new Output[](1);
        maxSpent[0] = Output({
            token: address(0),
            amount: 0, // free ENS mints
            recipient: bytes32(uint256(uint160(ensData.recipient))),
            chainId: ensData.chainId
        });

        // For ENS, we consider it as a unique token with amount 1
        Output[] memory minReceived = new Output[](1);
        minReceived[0] = Output({
            token: ensData.tokenIn,
            amount: ensData.amountIn,
            recipient: bytes32(uint256(uint160(msg.sender))),
            chainId: order.originChainId
        });

        FillInstruction[] memory instructions = new FillInstruction[](1);
        instructions[0] = FillInstruction({
            destinationChainId: ensData.chainId,
            destinationSettler: address(this),
            target: ensData.registry,
            value: 0,
            originData: abi.encode(order.user, order.fillDeadline, ensData)
        });

        return
            ResolvedCrossChainOrder({
                user: order.user,
                originChainId: order.originChainId,
                openDeadline: order.openDeadline,
                fillDeadline: order.fillDeadline,
                orderId: _hashOrder(order),
                maxSpent: maxSpent,
                minReceived: minReceived,
                fillInstructions: instructions
            });
    }

    function fill(
        bytes32 orderId,
        bytes calldata originData,
        bytes calldata fillerData
    ) external nonReentrant {
        require(orderResolved[orderId] == 0, "Order already resolved");

        (address user, uint32 fillDeadline, EnsData memory ensData) = abi
            .decode(originData, (address, uint32, EnsData));

        require(block.timestamp <= fillDeadline, "Fill deadline expired");

        EnsFillData memory fillDetails = abi.decode(fillerData, (EnsFillData));

        // Verify the label matches
        require(
            keccak256(bytes(ensData.label)) ==
                keccak256(bytes(fillDetails.label)),
            "Label mismatch"
        );
        require(
            ensData.recipient == fillDetails.owner,
            "User address mismatch"
        );
        require(user == fillDetails.owner, "User address mismatch");

        (bool success, ) = ensData.registry.call{value: 0}(fillerData);
        require(success, "external call reverted");

        // Here you would typically interact with ENS contracts
        // For this example, we'll just emit an event
        orderResolved[orderId] = 1;

        emit OrderFilled(orderId, abi.encode(fillDetails));
    }

    // Internal functions
    function _handlePermit2Transfer(
        address owner,
        address token,
        uint256 amount,
        bytes memory signature
    ) internal {
        // Implementation depends on specific Permit2 approval structure
        // This is a simplified version
        permit2.permitTransferFrom(
            // Transfer details
            ISignatureTransfer.PermitTransferFrom({
                permitted: ISignatureTransfer.TokenPermissions({
                    token: token,
                    amount: amount
                }),
                nonce: nonces[owner],
                deadline: block.timestamp
            }),
            // Transfer recipient
            ISignatureTransfer.SignatureTransferDetails({
                to: address(this),
                requestedAmount: amount
            }),
            // Owner
            owner,
            // Signature
            signature
        );
    }

    function _hashOrder(
        GaslessCrossChainOrder memory order
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    order.originSettler,
                    order.user,
                    order.nonce,
                    order.originChainId,
                    order.openDeadline,
                    order.fillDeadline,
                    order.orderDataType,
                    keccak256(order.orderData)
                )
            );
    }

    function _verifySignature(
        GaslessCrossChainOrder memory order,
        bytes memory signature
    ) internal pure returns (bool) {
        bytes32 orderHash = _hashOrder(order);
        address signer = orderHash.recover(signature);
        return signer == order.user;
    }

    function settleForFulfiller(
        bytes32 orderHash,
        bool successfullyFulfilled
    ) external onlyRole(ORACLE_ROLE) nonReentrant {
        require(
            !orderSettlement[orderHash].orderSettled,
            "Order already settled"
        );

        OrderStake memory orderDetails = orderSettlement[orderHash];

        if (successfullyFulfilled) {
            IERC20(address(orderDetails.minReceive.token)).transfer(
                orderDetails.filler,
                orderDetails.minReceive.amount
            );
            orderSettlement[orderHash].orderSettled = true;
            orderSettlement[orderHash].orderSuccessful = true;
        } else {
            IERC20(address(orderDetails.minReceive.token)).transfer(
                orderDetails.user,
                orderDetails.minReceive.amount
            );
            orderSettlement[orderHash].orderSettled = true;
            orderSettlement[orderHash].orderSuccessful = false;
        }
        emit OrderSettled(orderHash, successfullyFulfilled);
    }

    function getEncodedData(
        address tokenIn,
        uint256 amountIn,
        string memory label,
        uint64 chainId,
        address registry,
        address recipient
    ) public pure returns (bytes memory) {
        return
            abi.encode(
                EnsData({
                    tokenIn: tokenIn,
                    amountIn: amountIn,
                    label: label,
                    chainId: chainId,
                    registry: registry,
                    recipient: recipient
                })
            );
    }
}
