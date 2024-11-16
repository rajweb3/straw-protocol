// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/StrawSettler.sol";
import "../contracts/interfaces/Permit2/IPermit2.sol";
import "../contracts/interfaces/Permit2/ISignatureTransfer.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockPermit2 is IPermit2 {
    mapping(address => mapping(address => uint256)) public _nonceBitmap;

    // ISignatureTransfer implementations
    function permitTransferFrom(
        PermitTransferFrom memory permit,
        SignatureTransferDetails calldata transferDetails,
        address owner,
        bytes calldata signature
    ) external {
        IERC20(permit.permitted.token).transferFrom(
            owner,
            transferDetails.to,
            transferDetails.requestedAmount
        );
    }

    function permitWitnessTransferFrom(
        PermitTransferFrom memory permit,
        SignatureTransferDetails calldata transferDetails,
        address owner,
        bytes32 witness,
        string calldata witnessTypeString,
        bytes calldata signature
    ) external {
        // Mock implementation
    }

    // IPermit2 implementations
    function approve(
        address token,
        address spender,
        uint160 amount,
        uint48 expiration
    ) external {
        // Mock implementation
    }

    function permit(
        address owner,
        PermitBatch memory permitBatch,
        bytes calldata signature
    ) external {
        // Mock implementation
    }

    function transferFrom(
        address from,
        address to,
        uint160 amount,
        address token
    ) external {
        // Mock implementation
    }

    function transferFromBatch(
        address from,
        address[] calldata to,
        uint160[] calldata amount,
        address[] calldata token
    ) external {
        // Mock implementation
    }

    function allowance(
        address user,
        address token,
        address spender
    ) external view returns (uint160 amount, uint48 expiration, uint48 nonce) {
        return (0, 0, 0);
    }

    function invalidateUnorderedNonce(uint256 nonce) external {
        // Mock implementation
    }

    function DOMAIN_SEPARATOR() external view returns (bytes32) {
        return bytes32(0);
    }

    function nonceBitmap(
        address user,
        address wordPos
    ) external view returns (uint256) {
        return _nonceBitmap[user][wordPos];
    }

    function permitTransferFrom(
        PermitBatchTransferFrom memory permit,
        SignatureTransferDetails[] calldata transferDetails,
        address owner,
        bytes calldata signature
    ) external override {}

    function permitWitnessTransferFrom(
        PermitBatchTransferFrom memory permit,
        SignatureTransferDetails[] calldata transferDetails,
        address owner,
        bytes32 witness,
        string calldata witnessTypeString,
        bytes calldata signature
    ) external override {}

    function invalidateUnorderedNonces(
        uint256 wordPos,
        uint256 mask
    ) external override {}

    function permit(
        address owner,
        PermitSingle memory permitSingle,
        bytes calldata signature
    ) external override {}

    function transferFrom(
        AllowanceTransferDetails[] calldata transferDetails
    ) external override {}

    function lockdown(
        TokenSpenderPair[] calldata approvals
    ) external override {}

    function invalidateNonces(
        address token,
        address spender,
        uint48 newNonce
    ) external override {}

    function nonceBitmap(
        address,
        uint256
    ) external view override returns (uint256) {}
}
contract MockERC20 is IERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    uint256 private _totalSupply;

    function mint(address to, uint256 amount) external {
        _balances[to] += amount;
        _totalSupply += amount;
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        return true;
    }

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        _allowances[msg.sender][spender] = amount;
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool) {
        require(
            _allowances[from][msg.sender] >= amount,
            "Insufficient allowance"
        );
        _allowances[from][msg.sender] -= amount;
        _balances[from] -= amount;
        _balances[to] += amount;
        return true;
    }
}

contract StrawSettlerTest is Test {
    StrawSettler public settler;
    MockPermit2 public permit2;
    MockERC20 public token;

    address public user;
    address public filler;
    uint256 public userPrivateKey;

    event OrderOpened(
        bytes32 indexed orderHash,
        address indexed user,
        IERC7683.GaslessCrossChainOrder order
    );
    event OrderFilled(bytes32 indexed orderHash, bytes fillData);

    function setUp() public {
        permit2 = new MockPermit2();
        settler = new StrawSettler(address(permit2));
        token = new MockERC20();

        userPrivateKey = 0xA11CE;
        user = vm.addr(userPrivateKey);
        filler = address(0xF11157);

        // Fund user with tokens
        token.mint(user, 1000 ether);
        vm.prank(user);
        token.approve(address(permit2), type(uint256).max);
    }

    function testOpenForBasicFlow() public {
        IERC7683.GaslessCrossChainOrder memory order = _createValidOrder();
        bytes memory signature = _signOrder(order, userPrivateKey);

        vm.prank(filler);
        bytes32 orderHash = settler.openFor(order, signature);

        assertTrue(settler.orderExists(orderHash));
        assertEq(settler.nonces(user), 1);
    }

    function testOpenForExpiredOrder() public {
        IERC7683.GaslessCrossChainOrder memory order = _createValidOrder();
        order.openDeadline = uint32(block.timestamp - 1);
        bytes memory signature = _signOrder(order, userPrivateKey);

        vm.prank(filler);
        vm.expectRevert("Order expired");
        settler.openFor(order, signature);
    }

    function testOpenForInvalidSettler() public {
        IERC7683.GaslessCrossChainOrder memory order = _createValidOrder();
        order.originSettler = address(0x123);
        bytes memory signature = _signOrder(order, userPrivateKey);

        vm.prank(filler);
        vm.expectRevert("Inovked incorrect settler");
        settler.openFor(order, signature);
    }

    function testResolveForBasicFlow() public {
        IERC7683.GaslessCrossChainOrder memory order = _createValidOrder();
        bytes memory originFillerData = "";

        IERC7683.ResolvedCrossChainOrder memory resolved = settler.resolveFor(
            order,
            originFillerData
        );

        assertEq(resolved.user, order.user);
        assertEq(resolved.originChainId, order.originChainId);
        assertEq(resolved.openDeadline, order.openDeadline);
        assertEq(resolved.fillDeadline, order.fillDeadline);
    }

    function testFillBasicFlow() public {
        // First open an order
        IERC7683.GaslessCrossChainOrder memory order = _createValidOrder();
        bytes memory signature = _signOrder(order, userPrivateKey);

        vm.prank(filler);
        bytes32 orderHash = settler.openFor(order, signature);

        // Prepare fill data
        IERC7683.EnsData memory ensData = abi.decode(
            order.orderData,
            (IERC7683.EnsData)
        );
        bytes memory originData = abi.encode(user, order.fillDeadline, ensData);

        IERC7683.EnsFillData memory fillData = IERC7683.EnsFillData({
            label: ensData.label,
            owner: ensData.recipient
        });

        vm.prank(filler);
        settler.fill(orderHash, originData, abi.encode(fillData));

        assertEq(settler.orderResolved(orderHash), 1);
    }

    function testFillAlreadyResolved() public {
        // First open and fill an order
        IERC7683.GaslessCrossChainOrder memory order = _createValidOrder();
        bytes memory signature = _signOrder(order, userPrivateKey);

        vm.prank(filler);
        bytes32 orderHash = settler.openFor(order, signature);

        IERC7683.EnsData memory ensData = abi.decode(
            order.orderData,
            (IERC7683.EnsData)
        );
        bytes memory originData = abi.encode(user, order.fillDeadline, ensData);

        IERC7683.EnsFillData memory fillData = IERC7683.EnsFillData({
            label: ensData.label,
            owner: ensData.recipient
        });

        vm.prank(filler);
        settler.fill(orderHash, originData, abi.encode(fillData));

        // Try to fill again
        vm.expectRevert("Order already resolved");
        settler.fill(orderHash, originData, abi.encode(fillData));
    }

    // Helper functions
    function _createValidOrder()
        internal
        view
        returns (IERC7683.GaslessCrossChainOrder memory)
    {
        IERC7683.EnsData memory ensData = IERC7683.EnsData({
            tokenIn: address(token),
            amountIn: 1 ether,
            label: "test",
            recipient: user,
            registry: address(0x123),
            chainId: 1
        });

        return
            IERC7683.GaslessCrossChainOrder({
                originSettler: address(settler),
                user: user,
                nonce: 0,
                originChainId: block.chainid,
                openDeadline: uint32(block.timestamp + 1 hours),
                fillDeadline: uint32(block.timestamp + 2 hours),
                orderDataType: settler.ENS_ORDER_TYPE(),
                orderData: abi.encode(ensData)
            });
    }

    function _signOrder(
        IERC7683.GaslessCrossChainOrder memory order,
        uint256 privateKey
    ) internal pure returns (bytes memory) {
        bytes32 orderHash = keccak256(
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

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, orderHash);
        return abi.encodePacked(r, s, v);
    }
}
