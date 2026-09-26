const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying Reputation.sol to Base Sepolia...");

    const Reputation = await ethers.getContractFactory("Reputation");
    const reputationContract = await Reputation.deploy();

    // Safely grab the address whether you are on Ethers v5 or v6
    const contractAddress = reputationContract.target || reputationContract.address;

    console.log(`✅ Reputation Contract deployed to: ${contractAddress}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});