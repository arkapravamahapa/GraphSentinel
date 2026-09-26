// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Reputation {
    mapping(address => uint256) public userScores;
    address public admin;

    event ScoreUpdated(address indexed user, uint256 newScore);

    constructor() {
        admin = msg.sender;
    }

    function updateScore(address _user, uint256 _score) external {
        require(msg.sender == admin, "Not authorized");
        userScores[_user] = _score;
        emit ScoreUpdated(_user, _score);
    }

    function getScore(address _user) external view returns (uint256) {
        return userScores[_user];
    }
}