// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice() internal view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        (, int256 answer, , , ) = priceFeed.latestRoundData();

        return uint256(answer * 1e10); //since asnwer is in int256
        //8 decimals * 1e10=18 decimals
    }

    function getVersion() internal view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        return priceFeed.version();
    }

    function getConversionRate(
        uint256 ethamount
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice();
        uint256 ethAmtinUsd = (ethPrice * ethamount) / 1e18;
        return ethAmtinUsd;
    }
}
