# Compile
zokrates compile -i root.zok

# Perform the setup phase
zokrates setup

# Execute the program
zokrates compute-witness --abi --stdin < commit_test.json

# Generate a proof of computation
zokrates generate-proof

# Export a Solidity verifier
zokrates export-verifier

# Alternatively, verify natively
zokrates verify