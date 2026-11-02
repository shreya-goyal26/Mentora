from agents.customer_simulator import simulate_customer

state = {
    "scenario": "Late Delivery",
    "frustration_level": 4,
    "communication_style": "impatient",
    "patience_level": "low"
}

message = simulate_customer(state)

print("Simulated Customer Message:")
print(message)