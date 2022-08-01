const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

// getBalance of the address pass as argument
const getBalance = async (address) => {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
};

const main = async () => {
  const contractAddress = "0x0ADCeA22C7880D4884dc9feE05206f22457F8465";
  const contractABI = abi.abi;

  // Connect to the contract
  const provider = new hre.ethers.providers.AlchemyProvider(
    "goerli",
    process.env.GOERLI_API__KEY
  );

  // Ensure that signer is the SAME address as the original contract deployer,
  // or else this script will fail with an error.
  const signer = new hre.ethers.Wallet(
    process.env.GOERLI_PRIVATE_KEY,
    provider
  );

  // Instantiate connected contract.
  const buyMeACoffee = new hre.ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
