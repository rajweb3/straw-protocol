//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/StrawSettler.sol";
import "./DeployHelpers.s.sol";

contract DeployYourContract is ScaffoldETHDeploy {
    // use `deployer` from `ScaffoldETHDeploy`
    function run() external ScaffoldEthDeployerRunner {
        StrawSettler strawSettler = new StrawSettler(
            0x000000000022D473030F116dDEE9F6B43aC78BA3
        );
        console.logString(
            string.concat(
                "StrawSettler deployed at: ",
                vm.toString(address(strawSettler))
            )
        );
    }
}
