// function deployFunc() {
//   console.log("HI");
// }

const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");

// module.exports.default = deployFunc;

// module.exports = async (hre) => { //hre=hardhat runtime environment
//   const { getNamedAccounts, deployments } = hre;
//   //hre.getNamedAccounts
// };

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // const ethUsdPriceFeedAddr = networkConfig[chainId]["ethUsdPriceFeed"];
  let ethUsdPriceFeedAddr;

  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await get("MockV3Aggregator");
    ethUsdPriceFeedAddr = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddr = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  //what happens when we want to change chains
  //when going for localhost or hardhat network we use mock

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddr], //put pricefeed address,
    log: true,
  });
};

module.exports.tags = ["all", "fundme"];
