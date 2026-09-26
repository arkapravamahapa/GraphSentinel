# PRD: GraphSentinel

## 1\. Product Overview

GraphSentinel is an autonomous, multimodal AI security protocol designed for Decentralized Finance (DeFi). Unlike traditional blockchain analytics tools that merely flag suspicious activity after the fact, GraphSentinel actively monitors liquidity pools in real-time. By fusing Graph Neural Networks (GNN) to map wallet connections and Convolutional Neural Networks (CNN) to analyze temporal trading patterns, it detects coordinated market manipulation (such as wash trading and pump-and-dumps). Upon detection, an Agentic AI autonomously executes defensive smart-contract trades in milliseconds to neutralize the attack and protect user funds.

## 2\. Problem Statement (PS)

The DeFi ecosystem loses billions of dollars annually to coordinated market manipulation, specifically wash trading and pump-and-dump schemes. Scammers use networks of Sybil (fake) wallets to create artificial volume, tricking retail investors and draining liquidity pools.  
Currently, the industry faces a critical security gap:

1. Reactive Forensics: Industry standards like Chainalysis, Elliptic, and Forta Network are passive. They send alerts or dashboard notifications after or while the exploit is happening, requiring slow human intervention.  
2. Predatory Automation: Existing autonomous on-chain bots (MEV searchers) are purely profit-driven. They exploit market inefficiencies (front-running, sandwich attacks) to extract value, offering zero protection to protocols.  
3. The "Human-in-the-Loop" Bottleneck: By the time a human analyst reviews an alert from a reactive tool, the liquidity has already been drained. There is no commercial system that combines advanced machine learning with autonomous, on-chain defensive execution.

## 3\. Goal

To shift the paradigm of Web3 security from Reactive Forensics to Autonomous Active Defense.  
The primary goal of this 36-hour hackathon MVP is to build a functional, end-to-end prototype that demonstrates:

1. The accurate detection of synthetic wash-trading rings using multimodal ML (GNN \+ CNN).  
2. The autonomous decision-making capability of an Agentic AI.  
3. The trustless, real-time execution of a defensive trade via a Web3 smart contract.

## 4\. Target Users

* Primary User: DeFi Protocol Admins / DAO Treasuries  
  * Use Case: Protocol developers and DAOs who integrate GraphSentinel as a "security oracle" to protect their Total Value Locked (TVL) and ensure fair trading environments for their users.  
* Secondary User: Liquidity Providers (LPs) & Retail Investors  
  * Use Case: Everyday crypto users who deposit funds into protected liquidity pools, benefiting from the automated shielding of their assets against manipulation.

## 5\. Core Features (MVP Scope)

### Feature 1: Multimodal Threat Detection Engine (The "Brain")

* Description: A backend ML pipeline that analyzes incoming transaction batches to generate a unified Threat\_Score (0.0 to 1.0).  
* Components:  
  * GNN Module (Structural Analysis): Uses PyTorch Geometric to map wallet-to-wallet transaction graphs. Flags topological anomalies like dense, circular trading loops indicative of Sybil/wash-trading rings.  
  * CNN Module (Temporal Analysis): Converts transaction time-series data (volume, velocity, price impact) into 2D Gramian Angular Field (GAF) images. Uses a pre-trained ResNet-18 to detect the chaotic visual "shape" of algorithmic manipulation.  
  * Fusion Layer: A simple MLP (Multilayer Perceptron) that combines the GNN and CNN outputs into a final probability score.  
* Hackathon Scope Note: The MVP will utilize a robust synthetic data generator to simulate normal vs. wash-trading behavior to prove the pipeline's efficacy.

### Feature 2: The "Threat Radar" Dashboard (The UI)

* Description: A sleek, real-time frontend interface for Protocol Admins to monitor pool health and AI activity.  
* Components:  
  * Live Network Graph: A force-directed visualization (using React Force Graph) showing wallet nodes. Normal trades are blue; suspicious clusters dynamically shift to yellow, then red.  
  * GAF Heatmap Viewer: A side panel displaying the real-time conversion of trade data into CNN-readable images, overlaid with the visual anomaly score.  
  * Agent Terminal: A live-streaming chat interface showing the Agentic AI’s internal reasoning (e.g., "GNN score 85%. CNN score 92%. Fused Threat: 94%. Initiating Defense.").

### Feature 3: Autonomous Interceptor Agent (The "Hands")

* Description: An LLM-based Agent that acts as the autonomous security guard, taking action without human approval.  
* Components:  
  * Built using CrewAI / LangChain.  
  * Trigger Mechanism: Wakes up only when the Threat\_Score exceeds a predefined threshold (e.g., \> 0.90).  
  * Tool Calling: The Agent autonomously queries the blockchain mempool, calculates the optimal counter-trade parameters (e.g., a stabilizing arbitrage swap), and cryptographically signs the transaction using a secure backend wallet.

### Feature 4: Smart Contract Defense & Bounty Vault (The "Trust Layer")

* Description: The on-chain execution layer that validates the AI and manages incentives.  
* Components:  
  * DefensePool.sol: A smart contract holding the liquidity. It features an executeDefense(bytes signature) function that only accepts transactions signed by the verified Agentic AI wallet address.  
  * BountyManager.sol: An incentive mechanism. Upon successful execution of a defensive trade that neutralizes a threat, the contract automatically calculates and transfers a micro-bounty (e.g., in ETH or USDC) to the AI Agent’s wallet to cover compute/gas costs and incentivize the protocol.

