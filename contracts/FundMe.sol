// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./PriceConverter.sol";

error NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    //constant and immutable are gas savers
    //constant used if used insiide function and immutable if inside constructor
    //819952gas
    //800392 when constant used
    //800392 when both constant and immutable used

    uint256 public constant minUSD = 50 * 1e18;
    //use 50/current usd price for 1 eth ;then to WEI

    address[] public funders;
    mapping(address => uint256) public addrToAmt;

    address public immutable owner;

    constructor() {
        owner = msg.sender;
    }

    function fund() public payable {
        require(msg.value.getConversionRate() > minUSD, "Didnot send enough");
        //msg.value is send as 1st parameter to getConversionRate()
        //if 2nd param present send inside bracket

        funders.push(msg.sender);
        addrToAmt[msg.sender] = msg.value;
    }

    modifier onlyOwner() {
        // require(msg.sender==owner,"Sender is not owner");
        if (msg.sender != owner) {
            revert NotOwner();
        }
        _; //rest of the code
    }

    function withdraw() public onlyOwner {
        //to allow only owner to withdraw fund
        // require(msg.sender==owner,"Sender is not owner");

        for (uint256 i = 0; i < funders.length; i++) {
            address addr = funders[i];
            addrToAmt[addr] = 0;
        }

        //to reset the funders array
        funders = new address[](0); //represents 0 element

        //3 ways to transfer eth

        //     //transfer;address ie msg.sender to payable address;if failed reverts
        //     payable (msg.sender).transfer(address(this).balance);
        //    }

        //    //send; if fails returns bool value
        //    bool success = payable (msg.sender).send(address(this).balance);
        //    require(success,"Send failed");

        //call
        (bool callSuccess, bytes memory dataReturned) = payable(msg.sender)
            .call{value: address(this).balance}("");
        require(callSuccess, "Send failed");
    }

    //what happens if someone send eth without using fund function

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
