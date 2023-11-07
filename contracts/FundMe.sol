// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./PriceConverter.sol";

error FundMe__NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    //constant and immutable are gas savers
    //constant used if used insiide function and immutable if inside constructor
    //819952gas
    //800392 when constant used
    //800392 when both constant and immutable used

    uint256 public constant MINUSD = 50 * 1e18;
    //use 50/current usd price for 1 eth ;then to WEI

    address[] public s_funders;
    mapping(address => uint256) public s_addrToAmt;

    address public immutable i_owner;

    AggregatorV3Interface s_priceFeed;

    constructor(address s_priceFeedAddr) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(s_priceFeedAddr);
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeed) > MINUSD,
            "Didnot send enough"
        );
        //msg.value is send as 1st parameter to getConversionRate()
        //if 2nd param present send inside bracket

        s_funders.push(msg.sender);
        s_addrToAmt[msg.sender] = msg.value;
    }

    modifier onlyi_owner() {
        // require(msg.sender==i_owner,"Sender is not i_owner");
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _; //rest of the code
    }

    function withdraw() public onlyi_owner {
        //to allow only i_owner to withdraw fund
        // require(msg.sender==i_owner,"Sender is not owner");

        for (uint256 i = 0; i < s_funders.length; i++) {
            address addr = s_funders[i];
            s_addrToAmt[addr] = 0;
        }

        //to reset the s_funders array
        s_funders = new address[](0); //represents 0 element

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Send failed");
    }

    function cheaperWithdraw() public payable onlyi_owner {
        //reading and storing to/from storage cost way more gas
        address[] memory funders = s_funders; //memory is way cheaper than storage

        for (uint256 i = 0; i < funders.length; i++) {
            address addr = funders[i];
            //mappings cant be in memory
            s_addrToAmt[addr] = 0;
        }

        s_funders = new address[](0);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }

    //what happens if someone send eth without using fund function

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
