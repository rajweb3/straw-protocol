//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import "../contracts/StrawSettler.sol";
import { DeployYourContract } from "./DeployYourContract.s.sol";

contract DeployScript is ScaffoldETHDeploy {
  function run() external {
    StrawSettler strawSettler = new StrawSettler(
            0x000000000022D473030F116dDEE9F6B43aC78BA3
        );
        console.logString(
            string.concat(
                "StrawSettler deployed at: ",
                vm.toString(address(strawSettler))
            )
        );

    // deploy more contracts here
    // DeployMyContract deployMyContract = new DeployMyContract();
    // deployMyContract.run();
  }
}
