# Circuit Tasks

- ID Generation ✅
- Digital Signature Verification ✅
- Data Consistency ✅
- Credit Score Above Threshold ✅
- Merging 4 circuits ✅

# How to Test

Run the following commands on UNIX OS
- sed -i 's/\r$//' {circuit_test}.sh
- ./{circuit_test}.sh
- test_all --> Compilation, Setup, Proof
- clean_all --> Deletes all generated files
- test_comp --> Compilation, Proof
- clean_comp --> Delete out and proof files
- test_proof --> Proof only
- clean_proof --> Delete proof files