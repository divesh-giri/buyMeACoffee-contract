const hre = require("hardhat");

// getBalance of the address pass as argument
const getBalance = async (address) => {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
};

const printBalances = async (addresses) => {
  let indx = 0;
  for (const address of addresses) {
    console.log(`Address ${indx} balance: ${await getBalance(address)}`);
    indx++;
  }
};

// logs the memos stored on-chain from coffee purchases
const printMemos = (memos) => {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(
      `At ${timestamp}, ${tipper} (${tipperAddress}) said: ${message}`
    );
  }
};

async function main() {
  // Get Example Accounts
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  // Get the contract to deploy and deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log(`Contract is successfully deployed at: ${buyMeACoffee.address}`);

  // Check the Balances before the coffee purchase.
  console.log(owner.address);
  const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log("== START ==");
  await printBalances(addresses);
  // Buy the owner a few coffees
  const tip = { value: hre.ethers.utils.parseEther("1.0") };
  await buyMeACoffee
    .connect(tipper)
    .buyCoffee("Luffy", "Coffee for DG! Have a nice day!", tip);
  await buyMeACoffee
    .connect(tipper2)
    .buyCoffee("Zoro", "Enjoy your coffee! You are great!", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Dazai", "Its cool", tip);
  // Check Balance after the coffee purchase.
  console.log("== After Tips ==");
  await printBalances(addresses);
  // Withdraw funds
  await buyMeACoffee.withdrawTips();
  // Check Balance after withdraw
  console.log("== Tips Withdrawn ==");
  await printBalances(addresses);

  // Read all the memos left for the owner.
  console.log("== ALL MEMOS ==");
  printMemos(await buyMeACoffee.getAllMemos());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
