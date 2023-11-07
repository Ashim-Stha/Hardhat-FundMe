const { assert, expect } = require("chai");
const { ethers, getNamedAccounts } = require("hardhat");

describe("FundMe", () => {
  let fundMe, deployer, mockV3Aggregator, funder;
  const sendValue = ethers.parseEther("1"); //1eth

  beforeEach(async function () {
    // deploy our fundme contract
    // using hardhat deploy
    // const accounts = await ethers.getSigners()
    deployer = await ethers.provider.getSigner();
    funder = (await getNamedAccounts()).deployer;

    await deployments.fixture(["all"]); // deploy with tags
    fundMe = await ethers.getContractAt(
      "FundMe",
      (
        await deployments.get("FundMe")
      ).address,
      deployer
    ); // most recently deployed fundme contract
    mockV3Aggregator = await ethers.getContractAt(
      "MockV3Aggregator",
      (
        await deployments.get("MockV3Aggregator")
      ).address,
      deployer
    );
  });

  describe("constructor", () => {
    it("sets the aggregator addresses correctly", async function () {
      const response = await fundMe.getPriceFeed();
      assert.equal(response, await mockV3Aggregator.getAddress());
    });
  });

  describe("fund", async function () {
    it("Fails if you dont send enough eth", async function () {
      await expect(fundMe.fund()).to.be.revertedWith("Didnot send enough");
    });

    it("updated the amount funded data structure", async function () {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.addrToAmt(deployer);
      assert.equal(response.toString(), sendValue.toString());
    });

    it("adds funder to array of funders", async function () {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.funders(0);
      assert.equal(response, funder);
    });
  });

  describe("withdraw", async function () {
    beforeEach(async function () {
      await fundMe.fund({ value: sendValue });
    });

    it("withdraw eth from a single founder", async function () {
      const startingFundMeBalance = await ethers.provider.getBalance(
        fundMe.target
      );

      const startingDeployerBalance = await ethers.provider.getBalance(
        deployer
      );

      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, gasPrice } = transactionReceipt;
      const gasCost = gasUsed * gasPrice; //bigNumber

      const endingFundMeBalance = await ethers.provider.getBalance(
        fundMe.target
      );

      const endingDeployerBalance = await ethers.provider.getBalance(deployer);

      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        (startingFundMeBalance + startingDeployerBalance).toString(), //bigNumber
        (endingDeployerBalance + gasCost).toString()
      );
    });
  });
});
