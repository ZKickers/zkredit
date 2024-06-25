# Compile
zokrates compile -i root.zok

# Execute the program
zokrates compute-witness --abi --stdin < input.json

# Generate a proof of computation
zokrates generate-proof

# Alternatively, verify natively
zokrates verify