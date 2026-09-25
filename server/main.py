import asyncio

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from web3 import Web3

from agent.web3_tools import ExecuteDefenseTool
from generate_synthetic_data import get_transaction_batch
from ml.fusion import calculate_threat_score

app = FastAPI(title="GraphSentinel API")

# Allow the frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"status": "GraphSentinel Backend is running"}


# Global variable to control the stage demo attack simulation
attack_mode = False


@app.post("/api/simulate-attack")
async def simulate_attack():
    """Endpoint triggered by the frontend 'Simulate Attack' button."""
    global attack_mode
    attack_mode = True
    return {"message": "Wash-trading attack simulation triggered!"}


@app.post("/api/execute-defense")
async def execute_on_chain_defense(
    target_token: str = "0xEBFBA4aaF595a1aB3F22Bd411954bcDdf7CAeDe6",
    amount: int = 500,
):
    """Triggers the smart contract defense execution tool on-chain directly."""
    try:
        defense_tool = ExecuteDefenseTool()
        valid_address = Web3.to_checksum_address(target_token)

        result_message = defense_tool._run(
            signature="0xdeadbeef",
            target_token=valid_address,
            amount=amount,
        )

        return {"status": "success", "message": result_message}
    except Exception as exc:
        return {"status": "error", "message": str(exc)}


# WebSocket Manager to handle frontend connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)


manager = ConnectionManager()


@app.websocket("/ws/threat-radar")
async def websocket_endpoint(websocket: WebSocket):
    """Streams transaction data, threat scores, and GAF images to the frontend."""
    global attack_mode
    await manager.connect(websocket)
    try:
        while True:
            batch = get_transaction_batch(force_attack=attack_mode)

            ml_results = calculate_threat_score(batch)
            live_threat_score = ml_results["threat_score"]
            gaf_image = ml_results["gaf_image"]

            if live_threat_score > 0.90:
                status_msg = "Attack Detected!"
                attack_mode = False
            else:
                status_msg = "Safe"

            payload = {
                "transactions": batch,
                "threat_score": live_threat_score,
                "gaf_image_base64": gaf_image,
                "status": status_msg,
            }

            await websocket.send_json(payload)
            await asyncio.sleep(2)

    except WebSocketDisconnect:
        manager.disconnect(websocket)