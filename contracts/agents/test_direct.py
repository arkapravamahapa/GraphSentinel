from web3_tools import ExecuteDefenseTool
from web3 import Web3

if __name__ == "__main__":
    print("Initializing direct Web3 defense test...")
    
    # Initialize your custom Web3 tool
    defense_tool = ExecuteDefenseTool()
    
    # Automatically convert to a valid EIP-55 checksum address
    valid_address = Web3.to_checksum_address("0xEBFBA4aaF595a1aB3F22Bd411954bcDdf7CAeDe6")
    
    # Run the execution function directly
    result = defense_tool._run(
        signature="0xdeadbeef",
        target_token=valid_address,
        amount=500
    )
    
    print("\n### Direct Execution Result ###")
    print(result)