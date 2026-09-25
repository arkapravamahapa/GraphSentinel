// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DefensePool is ReentrancyGuard {
    // The designated AI Agent wallet that is allowed to trigger defenses
    address public authorizedAgent;

    event FundsDeposited(address indexed sender, uint256 amount);
    event DefenseExecuted(address indexed targetToken, uint256 amount);

    // Modifier to ensure only the CrewAI agent can call execution functions
    modifier onlyAuthorizedAgent() {
        require(msg.sender == authorizedAgent, "Unauthorized: AI Agent only");
        _;
    }

    // Set the AI Agent's address upon deployment
    constructor(address _agent) {
        authorizedAgent = _agent;
    }

    // Allows the pool to be funded with assets to protect
    function deposit() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }

    // The core defense payload triggered by a Threat Score > 0.90
    function executeDefense(bytes calldata signature, address targetToken, uint256 amount) 
        external 
        onlyAuthorizedAgent 
        nonReentrant 
    {
        // For the hackathon MVP, this simulates executing a defensive maneuver 
        // (e.g., routing funds to a secure vault or pausing protocol logic)
        
        emit DefenseExecuted(targetToken, amount);
    }
}