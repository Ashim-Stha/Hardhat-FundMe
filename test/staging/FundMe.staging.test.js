//these are the tests on testnet

const { getNamedAccounts, ethers, deployments, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert } = require("chai");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let fundMe, deployer;
      const sendValue = ethers.parseEther("0.4");

      beforeEach(async function () {
        deployer = await ethers.provider.getSigner();
        fundMe = await ethers.getContractAt(
          "FundMe",
          (
            await deployments.get("FundMe")
          ).address,
          deployer
        );
      });

      it("allows people to fud and withdraw", async function () {
        await fundMe.fund({ value: sendValue });
        await fundMe.withdraw();

        const endingFundMeBalance = await ethers.provider.getBalance(
          fundMe.target
        );

        assert.equal(endingFundMeBalance.toString(), "0");
      });
    });
