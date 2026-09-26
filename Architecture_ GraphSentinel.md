# Architecture: GraphSentinel

## 1\. The Flow of the App

The system operates as a continuous, real-time loop of monitoring, analysis, and autonomous execution.  
Data Ingestion (The Listener):

1. The backend continuously listens to on-chain transaction events from the target DeFi protocol (e.g., a Uniswap V3 liquidity pool) using WebSockets via an RPC provider (Alchemy/Infura).

Multimodal Analysis (The Brain):

2. Incoming transaction batches are routed to the ML Pipeline:  
   * Structural Check: Wallet addresses and transaction hashes are mapped into a dynamic graph. The GNN analyzes the topology for circular, Sybil-like trading loops.  
   * Temporal Check: Transaction volume, velocity, and price impact are converted into Gramian Angular Field (GAF) images. The CNN analyzes these images for chaotic, algorithmic manipulation patterns.  
   * Fusion: The outputs are combined into a single Threat\_Score (0.0 to 1.0).

Agentic Decision (The Orchestrator):

3. If the Threat\_Score exceeds the configured threshold (e.g., \> 0.90), the Agentic AI is triggered. The Agent evaluates the mempool, calculates the optimal defensive counter-trade (e.g., a stabilizing swap), and prepares the transaction payload.

On-Chain Execution (The Enforcer):

4. The Agent cryptographically signs the defensive transaction using a secure backend wallet and broadcasts it to the DefensePool.sol smart contract.

Resolution & Reward:

5. The smart contract validates the Agent's signature, executes the defensive trade to neutralize the price manipulation, and automatically transfers a micro-bounty to the Agent's wallet.

Real-Time Visualization (The UI):

6. Simultaneously, the backend streams the Threat\_Score, GAF images, and the Agent's internal reasoning logs to the frontend dashboard via WebSockets, updating the "Threat Radar" in real-time.

# Rules & Guidelines: GraphSentinel

This document serves as the strict rulebook for all AI coding assistants and human developers working on the GraphSentinel project. Adherence to these rules is mandatory to ensure we deliver a functional, cohesive MVP within the 36-hour hackathon limit.  
---

## 1\. What the AI Should Do (Core Directives)

* Prioritize the "Happy Path": Focus 90% of effort on making the primary demo flow work flawlessly (Attack Detected \-\> AI Acts \-\> Contract Executes). Edge cases can be mocked or ignored.  
* Write Modular, Typed Code:  
  * Use strict type hinting in Python (def calculate\_score(data: dict) \-\> float:).  
  * Use TypeScript interfaces for all frontend props and API responses.  
* Use Pre-trained Models: Always default to loading pre-trained weights (HuggingFace, TorchVision) and fine-tuning them lightly, rather than training from scratch.  
* Mock External Dependencies: If an external API (like a real-time mempool feed) is too complex to set up in 36 hours, write a robust mock/synthetic data generator that perfectly simulates the API's response.  
* Comment for the Pitch: Add brief, clear comments above complex ML or Smart Contract logic explaining what it does, so it can be easily extracted for the pitch deck.

---

## 2\. What the AI Should Avoid (Strict Anti-Patterns)

* NO Training from Scratch: Do not write code to train a GNN or CNN from scratch on raw data. It will take too long. Use pre-built architectures.  
* NO Mainnet Deployments: Never write code that interacts with Ethereum Mainnet. Use Base Sepolia, Polygon Amoy, or local Hardhat nodes.  
* NO Hardcoded Secrets: Never hardcode private keys, RPC URLs, or API keys. Always use python-dotenv or next.config.js environment variables.  
* NO Complex Custom UI: Do not write custom CSS from scratch. Use Tailwind CSS and pre-built component libraries (like Shadcn UI or Radix) to save time.  
* NO Over-Engineering the Agent: Do not give the Agentic AI 10 different tools. Restrict it to exactly 3 core tools: check\_threat\_level, calculate\_counter\_trade, and execute\_defense.  
* NO Heavy Frameworks: Do not use Django, Flask, or Spring Boot. Stick strictly to the approved lightweight stack.

---

## 3\. Approved Libraries & Tech Stack

The AI must only use the following libraries. If a required function isn't available in these, ask the developer before importing a new library.

### Frontend (Next.js)

* UI/Styling: tailwindcss, shadcn/ui (or standard HTML/Tailwind).  
* Web3: ethers (v6) or wagmi \+ viem.  
* Visualization: react-force-graph-2d (for the network graph), recharts (for basic charts).

### Backend & AI (Python)

* API: fastapi, uvicorn, pydantic.  
* ML/DL: torch, torch-geometric (GNN), transformers (HuggingFace CNN), pyts (for Gramian Angular Fields).  
* Data/Math: numpy, pandas, scikit-learn.  
* Agent: crewai or langchain (Pick ONE and stick to it).  
* Blockchain Backend: web3.py, eth-account.

### Smart Contracts (Solidity)

* Framework: hardhat, ethers (for testing).  
* Libraries: @openzeppelin/contracts (specifically Ownable, ReentrancyGuard, IERC20).

---

## 4\. Error Handling & Logging Standards

Robust error handling is critical so the demo doesn't crash on stage.

* Backend (FastAPI):  
  * Use Python's built-in logging module. Do not use print().  
  * Wrap all ML inference and Web3 calls in try/except blocks.  
  * Return standardized JSON errors: {"error": "ModelInferenceError", "message": "GNN failed to process graph"}.  
* Frontend (Next.js):  
  * Use React Error Boundaries to prevent the whole UI from crashing if a component fails.  
  * Use "Toast" notifications (e.g., react-hot-toast) to show Web3 transaction statuses (Pending, Success, Failed) to the user.  
* Smart Contracts (Solidity):  
  * Use require() statements with clear, descriptive error strings (e.g., require(msg.sender \== agent, "Only authorized agent");).  
  * Use custom errors for gas efficiency: error UnauthorizedAgent();.  
  * Always inherit ReentrancyGuard for any function that handles ETH/Token transfers.  
* Agentic AI:  
  * Implement a maximum of 2 retries with a 2-second delay for any tool call that fails (e.g., if the blockchain RPC is busy). If it fails twice, the Agent must log the error and halt gracefully.

---

## 5\. Project Constraints & Hackathon Scope

* Time Limit: 36 Hours. If a feature takes more than 4 hours to debug, cut it or mock it.  
* Compute Constraints: The ML pipeline must be lightweight enough to run on a standard laptop (e.g., MacBook Pro M1/M2) or a free-tier cloud instance (e.g., AWS EC2 t3.medium). Do not require massive GPU clusters.  
* Data Constraints: The MVP will rely on synthetic data. The AI should generate a Python script (generate\_synthetic\_data.py) that creates realistic-looking JSON data for normal trades and wash-trading rings to feed the ML models during the demo.  
* Security Constraints: This is a proof-of-concept. Do not implement enterprise-grade security like multi-sig wallets, complex KYC, or formal smart contract audits. Focus purely on the AI-to-Contract execution flow.  
* Demo Focus: The ultimate goal is a 3-minute stage presentation. Every line of code written must directly contribute to making that 3-minute demo look visually impressive and technically sound.  
    
  * 

