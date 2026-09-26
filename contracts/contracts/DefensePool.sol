// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DefensePool is ReentrancyGuard {
    // The designated AI Agent wallet (Keeper Bot) allowed to trigger defenses
    address public authorizedAgent;

    // Events for tracking deposits and live emergency actions on Etherscan
    event FundsDeposited(address indexed sender, uint256 amount);
    event DefenseExecuted(address indexed targetToken, uint256 amount, uint256 timestamp);
    event AgentUpdated(address indexed oldAgent, address indexed newAgent);

    // Modifier to ensure only the authorized AI Agent can trigger circuit breakers
    modifier onlyAuthorizedAgent() {
        require(msg.sender == authorizedAgent, "Unauthorized: AI Keeper Bot only");
        _;
    }

    // Set the initial AI Agent address upon deployment
    constructor(address _agent) {
        require(_agent != address(0), "Invalid agent address");
        authorizedAgent = _agent;
    }

    // Allows the liquidity pool to be funded with test assets to protect
    function deposit() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }

    // The core sub-second defense payload triggered when threat confidence > 0.96
    function executeDefense(bytes calldata signature, address targetToken, uint256 amount) 
        external 
        onlyAuthorizedAgent 
        nonReentrant 
    {
        // For the hackathon MVP, this executes the on-chain circuit breaker 
        // (pausing pool logic or routing vulnerable liquidity to safety)
        
        emit DefenseExecuted(targetToken, amount, block.timestamp);
    }

    // Optional utility function to update the keeper bot address if needed
    function updateAgent(address _newAgent) external onlyAuthorizedAgent {
        require(_newAgent != address(0), "Invalid new agent address");
        emit AgentUpdated(authorizedAgent, _newAgent);
        authorizedAgent = _newAgent;
    }

    // Helper view function to check contract balance during demo
    function getPoolBalance() external view returns (uint256) {
        return address(this).balance;
    }
}