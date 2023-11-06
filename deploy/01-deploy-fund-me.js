// function deployFunc() {
//   console.log("HI");
// }

const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

// module.exports.default = deployFunc;

// module.exports = async (hre) => { //hre=hardhat runtime environment
//   const { getNamedAccounts, deployments } = hre;
//   //hre.getNamedAccounts
// };

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  const ethUsdPriceFeedAddr = networkConfig[chainId]["ethUsdPriceFeed"];

  //what happens when we want to change chains
  //when going for localhost or hardhat network we use mock

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [], //put pricefeed address,
    log: true,
  });
};
