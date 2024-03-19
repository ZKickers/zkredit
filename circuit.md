# Circuit Tasks

- ID Generation ❌
- Digital Signature Verification ❌
- Data Consistency ❌
- Credit Score Above Threshold ❌
- Merging 4 circuitd ❌

# How to Test

Run the following commands on UNIX OS
- sed -i 's/\r$//' circuit_test.sh
- ./circuit_test.sh

# Circuit Inputs
1. ClientData from user {
    name: u8Array[N_name]
    address: u8Array[N_adr]
    birthdate: u8Array[8]
    ssn: u8Array[9]
}
2. Nonce (u8Array)
3. Response from API {
    name: u8Array[N_name]
    address: u8Array[N_adr]
    birthdate: u8Array[8]
    ssn: u8Array[9]
    score: u16
    signature{
        R: field
        S: field
    }
}
4. Public Key (field[2])
5. Threshold (u16)

## Commitment
- ClientData #1
- Nonce #2
## Digsig
- R (Signature) #3.R
- S (Signature) #3.S
- A (Public Key) #4
- M (Response) {response - Signature} (conc of #3)
## DataMatching
- ClientData (from user) #1
- ClientData (from Response) #3.clientData
## Threshold
- Score (from response) #3.score
- Threshold #5