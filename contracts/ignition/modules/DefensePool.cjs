const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DefensePoolModule", (m) => {
    // Automatically grabs your agent's wallet address from the hardhat config
    const deployer = m.getAccount(0);

    // Deploys the contract and passes the deployer address to the constructor
    const defensePool = m.contract("DefensePool", [deployer]);

    return { defensePool };
});