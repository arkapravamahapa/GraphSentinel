import random
import time
import uuid

def generate_normal_trade():
    """Generates a standard, benign transaction."""
    return {
        "tx_hash": str(uuid.uuid4()),
        "from_address": f"0x{random.randint(1000, 9999)}...{random.randint(1000, 9999)}",
        "to_address": f"0x{random.randint(1000, 9999)}...{random.randint(1000, 9999)}",
        "amount": round(random.uniform(0.1, 5.0), 2),
        "timestamp": int(time.time()),
        "is_wash_trade_simulation": False
    }

def generate_wash_trade_ring(num_wallets=4):
    """Generates a circular wash-trading loop (A -> B -> C -> A)."""
    wallets = [f"0xWASH{random.randint(1000, 9999)}...{random.randint(1000, 9999)}" for _ in range(num_wallets)]
    trades = []
    base_amount = round(random.uniform(10.0, 50.0), 2)
    
    for i in range(num_wallets):
        from_wallet = wallets[i]
        to_wallet = wallets[(i + 1) % num_wallets] # Creates the circular loop
        trades.append({
            "tx_hash": str(uuid.uuid4()),
            "from_address": from_wallet,
            "to_address": to_wallet,
            "amount": base_amount, 
            "timestamp": int(time.time()),
            "is_wash_trade_simulation": True
        })
    return trades

def get_transaction_batch(force_attack=False):
    """Returns a batch of trades, injecting an attack if triggered."""
    batch = []
    
    # Always generate some normal background noise
    for _ in range(random.randint(3, 8)):
        batch.append(generate_normal_trade())
        
    # Inject the wash trading ring if the simulation is triggered
    if force_attack:
        batch.extend(generate_wash_trade_ring())
        
    # Shuffle the batch to make the data look realistic
    random.shuffle(batch)
    return batch