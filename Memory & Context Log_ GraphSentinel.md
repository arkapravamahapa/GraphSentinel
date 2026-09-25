# Memory & Context Log: GraphSentinel

Instructions for AI:  
Read this file at the start of every new session or before executing a new task from task.md. Update this file dynamically as we build. If a major bug is fixed or a decision is changed, log it here immediately.  
---

## 1\. Project Context (Quick Refresher)

GraphSentinel is an autonomous DeFi security protocol. It detects wash-trading/market manipulation using a multimodal ML pipeline (GNN for graph structure, CNN for temporal GAF images). When a threat score \> 0.90 is detected, an Agentic AI autonomously executes a defensive trade via a Solidity smart contract on the Base Sepolia testnet.  
---

## 2\. Key Architectural Decisions

Log of critical "Why we did it this way" decisions to prevent the AI from suggesting alternatives that we've already ruled out.

* Decision 1: Synthetic Data over Real-Time Mainnet Data.  
  * Reason: 36-hour constraint. Parsing real-time Uniswap V3 subgraph data takes too long. We use a robust Python synthetic data generator to simulate normal vs. wash-trading rings for the demo.  
* Decision 2: Pre-trained CNN (ResNet-18) over Custom Training.  
  * Reason: Training a CNN from scratch requires massive datasets and compute. We use HuggingFace/PyTorch pre-trained weights and fine-tune lightly on GAF images.  
* Decision 3: Base Sepolia Testnet.  
  * Reason: Ethereum Mainnet is too slow and expensive for hackathon testing. Base Sepolia offers fast block times, near-zero gas fees, and EVM compatibility.  
* Decision 4: CrewAI for Agentic Orchestration.  
  * Reason: CrewAI provides a cleaner, more structured way to define agent roles, goals, and tools compared to raw LangChain, making it faster to implement in a hackathon.  
* Decision 5: WebSocket for Frontend-Backend Communication.  
  * Reason: REST polling is too slow for a "real-time threat radar". FastAPI WebSockets push threat scores and terminal logs to the Next.js frontend instantly.

---

## 3\. Current State & Progress Tracker

Update this section as tasks from task.md are completed.

* Task 1: Project Initialization & UI Shell (Next.js \+ Tailwind)  
* Task 2: Smart Contract Development & Deployment (Hardhat \+ Base Sepolia)  
* Task 3: Synthetic Data Generation & ML Pipeline (FastAPI \+ PyTorch)  
* Task 4: Agentic AI Orchestration (CrewAI \+ Tools)  
* Task 5: Backend-to-Blockchain Integration (Web3.py)  
* Task 6: Frontend Dashboard & Real-Time Visualization (React Force Graph)  
* Task 7: End-to-End Integration & Demo Polish

---

## 4\. Known Bugs, Quirks & Workarounds

Crucial for the AI to know what is currently broken, what is "mocked", and how to avoid repeating past errors.

* Bug 1: Web3.py Nonce Mismatch.  
  * Issue: When the Agent fires multiple defensive transactions rapidly, Web3.py throws a "nonce too low" error.  
  * Workaround: Always use web3.eth.get\_transaction\_count(agent\_address, 'pending') instead of 'latest' when building transactions.  
* Bug 2: React Force Graph Lag.  
  * Issue: If the synthetic data generator creates \>100 nodes, the frontend graph starts dropping frames.  
  * Workaround: Hardcode the synthetic data generator to cap the network at 50 nodes and 100 edges for the MVP demo.  
* Bug 3: GAF Image Generation Latency.  
  * Issue: Converting time-series to GAF images using pyts takes \~200ms per batch, causing a slight delay in the WebSocket stream.  
  * Workaround: Run the GAF conversion in a separate FastAPI background task (BackgroundTasks) so it doesn't block the main WebSocket stream.  
* Quirk 1: Mocked ML Inference.  
  * Status: The GNN and CNN are currently returning heuristic-based mock scores for the MVP to ensure the demo flow works perfectly. Real PyTorch inference will be swapped in during Task 7 if time permits.

---

## 5\. Changes & Pivots Log

Track what was changed from the original PRD/Architecture and why.

* Change 1: Dropped Multi-Sig Wallet for Agent.  
  * Original Plan: Agent uses a Gnosis Safe multi-sig.  
  * Change: Switched to a standard EOA (Externally Owned Account) via eth\_account in Web3.py. Multi-sig adds too much friction for a 36-hour autonomous demo.  
* Change 2: Simplified Bounty Logic.  
  * Original Plan: Complex dynamic bounty calculation based on gas used and threat severity.  
  * Change: Simplified to a flat 0.01 ETH bounty payout in the smart contract to save Solidity development time.  
* Change 3: UI Framework.  
  * Original Plan: Custom CSS.  
  * Change: Strictly enforced Tailwind CSS \+ Shadcn UI as per rules.md to speed up frontend development.

---

## 6\. Environment & Secrets Checklist

Reminders for the AI to ensure .env variables are handled correctly. NEVER output actual secrets in code.

* NEXT\_PUBLIC\_ALCHEMY\_RPC\_URL (Frontend)  
* FASTAPI\_RPC\_URL (Backend)  
* AGENT\_PRIVATE\_KEY (Backend \- Must be a testnet wallet with fake ETH\!)  
* AGENT\_PUBLIC\_ADDRESS (Backend \- Used for smart contract onlyAuthorizedAgent modifier)  
* DEFENSE\_POOL\_CONTRACT\_ADDRESS (Backend/Frontend)  
* HUGGINGFACE\_TOKEN (Backend \- if using gated models)

  * 

