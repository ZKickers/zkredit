# Functional Requirements

## User
- A single user can be client or creditor
- Can sign up by registering (username, password, email).
- Can log in any time with username and password.
- Passwords are hashed into the database with a randomness salt and potentially additional randomness pepper.

### Client Interface (Prover)
- Users enters his private data (Full Name, Date of birth, SSN, Phone Number, Address) to get the credit score, creating the user ID.
- User enters the Creditor username, and the user ID as well as his full name (for physical identity confirmation purposes) are sent to the Creditor.
- Upon verification, the client receives notification of the threshold check (credit score >= specified threshold)

### Verifier Interface (Creditor)
- Creditor receives a message containing the Client’s name and ID for credit score verification.
- Creditor enters the threshold on the credit score.
- Backend process is triggered, returning a ZK proof to be verified.
- If the ZK proof is valid, display the result of the threshold check (credit score >= threshold) and the Client name.

## Backend
### Client Data Submission
- When the Client sends data with the Creditor username, the backend requests the credit score from the Credit Bureau.
- If the response is successful, the Client ID is generated using client's private data, which is used later in the ZKP after Creditor confirms threshold
- Send the Client ID and Client name to the Creditor.

### Creditor Verification Request
- When the Creditor sends the threshold for a certain client, the backend generates a ZK proof that verifies:
    - Authenticity Proof:
        - Client ID is a commitment to the client’s data.
        - API response of the Credit Bureau is consistent with the client’s data.
    - Bureau's Digital Signature.
    - Client Credit score above the given threshold.
- Send the ZK proof to the Creditor.
- Destroy all client private data.

**Note:** Strings for ZK-Proof input need to be specified.