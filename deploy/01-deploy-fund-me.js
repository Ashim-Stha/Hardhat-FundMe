// function deployFunc() {
//   console.log("HI");
// }

const { network } = require("hardhat");

// module.exports.default = deployFunc;

// module.exports = async (hre) => { //hre=hardhat runtime environment
//   const { getNamedAccounts, deployments } = hre;
//   //hre.getNamedAccounts
// };

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  //what happens when we want to change chains
};
