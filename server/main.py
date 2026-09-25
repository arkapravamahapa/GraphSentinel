import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from generate_synthetic_data import get_transaction_batch
from ml.fusion import calculate_threat_score

app = FastAPI(title="GraphSentinel API")

# Allow the Next.js frontend to communicate with this backend
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
            # Generate the transaction batch
            batch = get_transaction_batch(force_attack=attack_mode)
            
            # Use the ML Fusion Pipeline to calculate the score AND get the GAF image
            ml_results = calculate_threat_score(batch)
            live_threat_score = ml_results["threat_score"]
            gaf_image = ml_results["gaf_image"]
            
            # Determine status based on the calculated score
            if live_threat_score > 0.90:
                status_msg = "Attack Detected!"
                attack_mode = False # Reset back to normal after one attack batch
            else:
                status_msg = "Safe"
                
            payload = {
                "transactions": batch,
                "threat_score": live_threat_score,
                "gaf_image_base64": gaf_image,
                "status": status_msg
            }
            
            await websocket.send_json(payload)
            await asyncio.sleep(2) # Stream new data every 2 seconds
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)