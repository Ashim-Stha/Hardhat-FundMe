require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
  },
  defaultNetwork: "hardhat",
  // networks: {
  //   sepolia: {
  //     url: "https://eth-sepolia.g.alchemy.com/v2/B8hivM5MpYmrXNZ0YKbHUJ-st8ywx2Tn",
  //     accounts:
  //       "bb57886497e3d955e333f73295a1473f7a6653a4d190c216b4d479bd43350385",
  //     chainId: 11155111,
  //   },
  // },
};
