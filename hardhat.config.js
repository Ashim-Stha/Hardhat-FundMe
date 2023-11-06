require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");

const acc = "bb57886497e3d955e333f73295a1473f7a6653a4d190c216b4d479bd43350385";
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/B8hivM5MpYmrXNZ0YKbHUJ-st8ywx2Tn",
      accounts: [acc],
      chainId: 11155111,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
  },
};
