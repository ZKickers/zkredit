# Proof Explanation

Inputs = Public Inputs + Outputs
- Threshold = Inputs[:2] --> Frontend should check that this is the threshold creditor entered after conversion from byte_array of size 2 to an integer
- ThresholdCheck = Inputs[2] --> Frontend should check if it is 0 or 1 to know if client's score met given threshold
- Timestamp = Inputs[3:11] --> Frontend should place it as a date and time on transaction and maybe order tranzactions by it after conversion from byte_array of size 8 to an integer
- Name = Inputs[11:] --> Frontend should check if it is identical to the name initially provided by client after conversion from byte_array of size 70 to a string

All the previous should be done after proof verification

# Proof passes only if

- Successful verification
- Names match
- Threshold match
- ThresholdCheck bit is 1