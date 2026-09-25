

cd server
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload --reload-exclude "venv*"


cd client
npm run dev
```
GraphSentinel
├─ Architecture_ GraphSentinel.md
├─ client
│  ├─ dist
│  │  ├─ assets
│  │  │  ├─ index-D4T6M4y2.css
│  │  │  ├─ index-q6KRofJv.js
│  │  │  └─ threat-radar-thumbnail-CANq3fHy.svg
│  │  ├─ favicon.svg
│  │  ├─ icons.svg
│  │  └─ index.html
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  ├─ threat-radar-thumbnail.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ ContactModal.tsx
│  │  │  ├─ DocsModal.tsx
│  │  │  ├─ Navbar.tsx
│  │  │  ├─ ThreatRadarDashboard.tsx
│  │  │  ├─ ui
│  │  │  │  ├─ demo.tsx
│  │  │  │  ├─ flame-button.tsx
│  │  │  │  └─ spotlight.tsx
│  │  │  ├─ WalletModal.tsx
│  │  │  └─ WatchDefenseModal.tsx
│  │  ├─ index.css
│  │  ├─ lib
│  │  │  └─ utils.ts
│  │  └─ main.tsx
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ contracts
│  ├─ contracts
│  │  └─ DefensePool.sol
│  ├─ hardhat.config.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ scripts
│  │  └─ send-op-tx.ts
│  ├─ test
│  │  └─ Counter.ts
│  ├─ tsconfig.json
│  └─ types
│     └─ ethers-contracts
│        ├─ common.ts
│        ├─ DefensePool.ts
│        ├─ factories
│        │  ├─ DefensePool__factory.ts
│        │  └─ index.ts
│        ├─ hardhat.d.ts
│        └─ index.ts
├─ Design System & UI Guidelines_ GraphSentinel.md
├─ Memory & Context Log_ GraphSentinel.md
├─ PRD_ GraphSentinel.md
├─ README.md
├─ rules.md
├─ server
│  ├─ agent
│  │  ├─ abi.json
│  │  ├─ orchestrator.py
│  │  ├─ test_direct.py
│  │  ├─ tools.py
│  │  └─ web3_tools.py
│  ├─ api
│  │  └─ websocket.py
│  ├─ blockchain
│  │  └─ web3_executor.py
│  ├─ data
│  │  ├─ cnn_n8n_input.json
│  │  └─ n8n_input_data.json
│  ├─ generate_synthetic_data.py
│  ├─ main.py
│  ├─ ml
│  │  ├─ cnn_model.py
│  │  ├─ fusion.py
│  │  └─ gnn_model.py
│  ├─ models
│  │  ├─ cnn_model.pkl
│  │  └─ gnn_model.pkl
│  └─ requirements.txt
├─ Task Breakdown_ GraphSentinel.md
└─ task.md

```