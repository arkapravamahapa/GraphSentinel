import os
import json
from web3 import Web3
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

class DefenseInput(BaseModel):
    signature: str = Field(..., description="The threat signature payload as a hex string (e.g., '0x1234...').")
    target_token: str = Field(..., description="The contract address of the target token.")
    amount: int = Field(..., description="The uint256 amount of tokens involved.")

class ExecuteDefenseTool(BaseTool):
    name: str = "Execute Smart Contract Defense"
    description: str = "Triggers the executeDefense function on the DefensePool smart contract to protect on-chain assets."
    args_schema: type[BaseModel] = DefenseInput

    def _run(self, signature: str, target_token: str, amount: int) -> str:
        w3 = Web3(Web3.HTTPProvider(os.getenv("ALCHEMY_RPC_URL")))
        account = w3.eth.account.from_key(os.getenv("AGENT_PRIVATE_KEY"))
        
        # Load the ABI from your extracted JSON file
        with open('abi.json', 'r') as file:
            abi = json.load(file)
            
        contract_address = w3.to_checksum_address("0xEBFBA4aaF595a1aB3F22Bd411954bcDdf7CAeDe6")
        contract = w3.eth.contract(address=contract_address, abi=abi)
        
        try:
            tx = contract.functions.executeDefense(
                w3.to_bytes(hexstr=signature),
                w3.to_checksum_address(target_token),
                amount
            ).build_transaction({
                'from': account.address,
                'nonce': w3.eth.get_transaction_count(account.address),
                'gas': 2000000,
                'gasPrice': w3.eth.gas_price
            })
            
            signed_tx = w3.eth.account.sign_transaction(tx, os.getenv("AGENT_PRIVATE_KEY"))
            tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
            return f"Defense executed successfully! TX Hash: {w3.to_hex(tx_hash)}"
        except Exception as e:
            return f"Failed to execute transaction: {str(e)}"