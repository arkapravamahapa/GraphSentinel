# Task Breakdown: GraphSentinel

## How to Use This File

1. Do not ask the AI to build everything at once. It will hallucinate and write incomplete code.  
2. Before starting a task, tell the AI: "Read rules.md, architecture.md, and design.md to understand the context. Now, execute Task \[X\] below."  
3. Verify the output of each task before moving to the next.

---

### Task 1: Project Initialization & UI Shell

Objective: Set up the Next.js frontend repository, configure Tailwind CSS, and build the static layout of the dashboard based on the design system.  
Tech Stack: Next.js, Tailwind CSS, Shadcn UI (optional).  
Instructions for AI:

* Initialize a Next.js project with TypeScript and Tailwind CSS.  
* Configure the tailwind.config.js to include the exact colors defined in design.md (Slate-950 background, Cyan-400 primary, Rose-500 danger).  
* Create the main dashboard layout: A fixed left sidebar (w-64) and a main content area using a 12-column CSS grid (grid-cols-12).  
* Create empty placeholder components for the main panels: NetworkGraph.tsx, AgentTerminal.tsx, GAFHeatmap.tsx, and StatCard.tsx.  
* Apply the glassmorphism styling (bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl) to all panels.  
* Deliverable: A running Next.js app showing the empty, beautifully styled dark-mode dashboard shell.

### Task 2: Smart Contract Development & Deployment

Objective: Write, test, and deploy the Solidity smart contracts that will act as the trustless execution layer.  
Tech Stack: Solidity, Hardhat, Ethers.js.  
Instructions for AI:

* Initialize a Hardhat project in the /contracts directory.  
* Write DefensePool.sol:  
  * Include a deposit() function to accept ETH/USDC.  
  * Include an executeDefense(bytes signature, address targetToken, uint256 amount) function.  
  * Add a onlyAuthorizedAgent modifier that verifies the transaction sender matches a hardcoded Agent wallet address.  
  * Inherit ReentrancyGuard and Ownable from OpenZeppelin.  
* Write a basic deployment script to deploy this contract to the Base Sepolia or Polygon Amoy testnet.  
* Deliverable: Compiled contracts, passing Hardhat tests, and the deployed contract address on the testnet.

### Task 3: Synthetic Data Generation & ML Pipeline (Backend)

Objective: Create the Python backend, generate fake wash-trading data, and build the ML inference endpoints.  
Tech Stack: Python, FastAPI, PyTorch, PyTorch Geometric, PyTS.  
Instructions for AI:

* Initialize a FastAPI project in the /server directory.  
* Write generate\_synthetic\_data.py: Create a script that generates JSON data for "normal trading" and "wash trading" (circular wallet loops with high velocity).  
* Build the ML Pipeline:  
  * Create a mock GNN inference function that takes a graph JSON and returns a structural\_score (0.0 to 1.0).  
  * Create a mock CNN inference function that takes time-series data, converts it to a Gramian Angular Field (GAF) image using pyts, and returns a visual\_score.  
  * Create a fusion function that averages them into a final threat\_score.  
* Create a FastAPI WebSocket endpoint (/ws/threat-radar) that continuously streams this synthetic data and the calculated threat\_score to the frontend.  
* Deliverable: A running FastAPI server that generates fake data and streams threat scores via WebSocket.

### Task 4: Agentic AI Orchestration

Objective: Build the AI Agent that monitors the threat score and autonomously decides to take action.  
Tech Stack: Python, CrewAI (or LangChain), Web3.py.  
Instructions for AI:

* In the /server/agent directory, set up a CrewAI/LangChain agent.  
* Define the Agent's persona: "You are GraphSentinel, an autonomous DeFi security expert."  
* Create exactly three tools for the Agent:  
  1. check\_threat\_level(): Reads the current threat score from the ML pipeline.  
  2. calculate\_counter\_trade(threat\_data): Calculates the token and amount needed to stabilize the pool.  
  3. execute\_defense\_on\_chain(trade\_params): Calls the Web3 backend to sign and send the transaction.  
* Write the logic: If threat\_score \> 0.90, the Agent must automatically call calculate\_counter\_trade and then execute\_defense\_on\_chain.  
* Deliverable: A Python script where the Agent successfully detects a high threat score and triggers the tool-calling sequence.

### Task 5: Backend-to-Blockchain Integration

Objective: Connect the Agentic AI to the deployed smart contract so it can actually execute transactions.  
Tech Stack: Python, Web3.py, eth\_account.  
Instructions for AI:

* In the /server/blockchain directory, write a Web3.py module.  
* Load the ABI and address of the deployed DefensePool.sol contract.  
* Write a function sign\_and\_execute\_defense(targetToken, amount):  
  * It must load the Agent's private key from environment variables (.env).  
  * It must build the transaction for the executeDefense smart contract function.  
  * It must sign the transaction locally and broadcast it to the Base Sepolia/Polygon Amoy RPC node.  
* Integrate this function into the Agent's execute\_defense\_on\_chain tool created in Task 4\.  
* Deliverable: The Agent successfully triggering a real transaction on the testnet that can be viewed on a block explorer.

### Task 6: Frontend Dashboard & Real-Time Visualization

Objective: Build the visual components of the dashboard and connect them to the backend WebSockets.  
Tech Stack: Next.js, React Force Graph, Ethers.js, WebSockets.  
Instructions for AI:

* Network Graph: Implement react-force-graph-2d. Connect it to the backend WebSocket. Map incoming wallet nodes: color them Cyan (normal), Amber (warning), or Rose (attack) based on the threat\_score.  
* Agent Terminal: Build a scrolling text box using the font-mono class. Stream the Agent's internal reasoning logs (e.g., "GNN Score: 0.85. CNN Score: 0.92. Threat: 0.88. Standing by...") into this box.  
* GAF Heatmap: Create a panel that displays the generated GAF images (you can pass them as Base64 strings from the backend) alongside the CNN confidence score.  
* Stat Cards: Connect the top row of cards to show mock metrics: "Total Value Protected", "Attacks Blocked", "AI Bounties Paid".  
* Deliverable: A fully interactive frontend that visually updates in real-time as the backend generates synthetic attack data.

### Task 7: End-to-End Integration & Demo Polish

Objective: Connect all systems, fix bugs, and prepare the "Happy Path" for the 3-minute pitch.  
Instructions for AI:

* Ensure the frontend WebSocket, backend ML pipeline, Agent, and Smart Contract are all communicating seamlessly.  
* Implement the "Toast" notifications (using react-hot-toast) on the frontend when the Agent successfully executes a defense on-chain.  
* Add a "Simulate Attack" button on the frontend UI that manually triggers the backend to generate a high-threat wash-trading ring, making the demo easy to control on stage.  
* Review all code against rules.md to ensure no anti-patterns (like hardcoded keys or heavy training loops) were accidentally introduced.  
* Deliverable: A flawless, end-to-end demo flow ready for presentation.

  * 

