import os
from dotenv import load_dotenv

# 1. BULLETPROOF HOTFIX: Strip any unsupported CrewAI parameters
os.environ["LITELLM_DROP_PARAMS"] = "True"

from crewai import Agent, Task, Crew, LLM
from web3_tools import ExecuteDefenseTool

# 2. Securely load environment variables
load_dotenv()

# Ensure the API key exists before proceeding
if not os.environ.get("OPENAI_API_KEY"):
    raise ValueError("Missing OPENAI_API_KEY in .env file!")

# 3. Initialize OpenAI (Credits are now loaded!)
openai_llm = LLM(
    model="gpt-4o",
    api_key=os.environ.get("OPENAI_API_KEY")
)

# 4. Initialize the Security Agent
security_agent = Agent(
    role='Blockchain Security Executor',
    goal='Execute on-chain defense mechanisms when a valid smart contract threat is identified.',
    backstory='You are an autonomous Web3 security agent. You monitor decentralized platforms and trigger defensive smart contract protocols to protect liquidity pools.',
    tools=[ExecuteDefenseTool()],
    llm=openai_llm,
    verbose=True,
    allow_delegation=False
)

# 5. Define a Test Task
test_task = Task(
    description="A simulated threat signature '0xdeadbeef' was detected targeting the token contract '0xEBFBA4aaF595a1aB3F22Bd411954bcDdf7CAeDe6' involving an amount of 500. Execute the defense protocol.",
    expected_output="Confirmation of the executed defense transaction including the transaction hash.",
    agent=security_agent
)

# 6. Assemble and Run the Crew
security_crew = Crew(
    agents=[security_agent],
    tasks=[test_task]
)

if __name__ == "__main__":
    print("Starting CrewAI Security Agent Test with OpenAI...")
    result = security_crew.kickoff()
    print("\n### Agent Execution Result ###")
    print(result)