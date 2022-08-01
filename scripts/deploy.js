const hre = require("hardhat");

const main = async () => {
  // Deploy the contract to testnet
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  console.log("Deploying....");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log(`Contract is successfully deployed at: ${buyMeACoffee.address}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
