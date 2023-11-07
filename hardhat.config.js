require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();
require("hardhat-gas-reporter");

const surl = process.env.RPC_URL_ALCHEMY || "https://eth-sepolia";
const pkey = process.env.PRIVATE_KEY || "0xkey";
const api = process.env.ETHERSCAN_API_KEY || "key";
const COINMARKETCAP_API = process.env.COINMARKETCAP_API || "key";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
  },
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: surl,
      accounts: [pkey],
      chainId: 11155111,
      blockConfirmations: 6,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
  },
  etherscan: {
    apiKey: api,
  },
  gasReporter: {
    enabled: true,
    noColors: true,
    outputFile: "gas-report.txt",
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API,
  },
};
