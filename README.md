Here is your complete and updated interactive `README.md` containing the project layout tree and execution commands for both your backend and frontend servers:

```markdown
# 🛡️ GraphSentinel

> **Real-Time Graph-Based Threat Intelligence & Decentralized Reputation Engine**  
> *Securing automated AI workflows and Web3 transactions with automated guardrails.*

[![Base Sepolia](https://img.shields.io/badge/Network-Base%20Sepolia-blue?logo=coinbase)](https://sepolia.basescan.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-005571?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🚀 Live Demos & Architecture

* **Frontend Dashboard (Vercel)**: [View Live App](https://graph-sentinel.vercel.app)
* **Backend Intelligence Engine (Render)**: [API Endpoint](https://graph-sentinel-backend.onrender.com)
* **Smart Contract (`DefensePool.sol`)**: [`0x63161d94DE1A6E6FcbBf299964DeE018587d000C`](https://sepolia.basescan.org/address/0x63161d94DE1A6E6FcbBf299964DeE018587d000C) on Base Sepolia

---

## 📌 Table of Contents
1. [Project Structure](#-project-structure)
2. [System Architecture](#-system-architecture)
3. [Tech Stack](#️-tech-stack)
4. [Getting Started Locally](#-getting-started-locally)
5. [Environment Variables](#-environment-variables)
6. [License](#-license)

---

## 🗂️ Project Structure

```text
GraphSentinel
├─ Architecture_ GraphSentinel.md
├─ client                         # React + Vite Frontend
│  ├─ dist
│  ├─ public
│  ├─ src
│  │  ├─ components               # UI & Modal Components (ThreatRadar, Navbar, etc.)
│  │  ├─ lib                      # Utility functions
│  │  ├─ App.tsx
│  │  └─ main.tsx
│  ├─ package.json
│  └─ vite.config.ts
├─ contracts                      # Hardhat Smart Contracts & Types
│  ├─ contracts
│  │  └─ DefensePool.sol
│  ├─ hardhat.config.ts
│  └─ types
├─ server                         # FastAPI Backend & ML/Agent Engine
│  ├─ agent                       # Orchestrator & Web3 Tools
│  ├─ api                         # WebSocket endpoints
│  ├─ blockchain                  # Web3 executors
│  ├─ ml                          # GNN, CNN, and Fusion models
│  ├─ models                      # Pickled model weights
│  ├─ main.py
│  └─ requirements.txt
└─ README.md

```

---

## 🏗️ System Architecture

```text
       ┌──────────────┐         ┌───────────────┐
       │   Telegram   │         │ n8n Workflow  │
       │  Interface   │         │ (Google Gemini│
       └──────┬───────┘         └──────┬────────┘
              │                        │
              └───────────┬────────────┘
                          ▼
             ┌─────────────────────────┐
             │  FastAPI Core Backend   │
             └────────────┬────────────┘
                          │
         ┌────────────────┴────────────────┐
         ▼                                 ▼
┌─────────────────┐               ┌─────────────────┐
│ Graph Analytics │               │ Base Sepolia SC │
│ & ML Guardrails │               │  (DefensePool)  │
└─────────────────┘               └─────────────────┘

```

---

## 🛠️ Tech Stack

* **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
* **Backend**: FastAPI, Uvicorn, Web3.py, PyTorch, PyTorch Geometric
* **Automation**: n8n, Google Gemini Chat Model, Telegram Bot API
* **Web3/Blockchain**: Solidity, Hardhat, Base Sepolia Testnet

---

## ⚙️ Getting Started Locally

### 1. Clone Repository & Initialize

```bash
git clone [https://github.com/arkapravamahapa/GraphSentinel.git](https://github.com/arkapravamahapa/GraphSentinel.git)
cd GraphSentinel

```

### 2. Run Backend Server (FastAPI)

Open your first terminal window for the backend:

```bash
cd server
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --reload-exclude "venv*"

```

### 3. Run Frontend Server (React + Vite)

Open a second terminal window for the client:

```bash
cd client
npm install
npm run dev

```

---

## 🔐 Environment Variables

Create a `.env` file inside your `server/` directory:

```env
BASE_SEPOLIA_RPC_URL=[https://sepolia.base.org](https://sepolia.base.org)
PRIVATE_KEY=your_wallet_private_key_here
CONTRACT_ADDRESS=0x63161d94DE1A6E6FcbBf299964DeE018587d000C
GEMINI_API_KEY=your_google_gemini_api_key

```

---
