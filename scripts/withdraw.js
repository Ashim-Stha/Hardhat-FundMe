const { ethers } = require("hardhat");
async function main() {
  const deployer = await ethers.provider.getSigner();
  const fundMe = await ethers.getContractAt(
    "FundMe",
    (
      await deployments.get("FundMe")
    ).address,
    deployer
  );

  console.log("Withdrawing...");

  const transactionResponse = await fundMe.withdraw();
  await transactionResponse.wait(1);
  console.log("Withdrawn");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
