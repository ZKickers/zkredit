# Compile
zokrates compile -i digsig.zok

# Perform the setup phase
zokrates setup

# Execute the program
zokrates compute-witness --abi --stdin < digsig_input.json

# Generate a proof of computation
zokrates generate-proof

# Export a Solidity verifier
zokrates export-verifier

# Alternatively, verify natively
zokrates verify