import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ReputationModule", (m) => {
    const reputation = m.contract("Reputation");
    return { reputation };
});