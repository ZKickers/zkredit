const TransactionStateEnum = {
  PENDING_THRESHOLD: "Pending_Threshold",
  PENDING_PROOF: "Pending_Proof",
  PENDING_VERIFICATION: "Pending_Verification",
  PENDING_CLIENT_DATA: "Pending_Client_Data",
  PASSED: "Passed", // Meet the threshold
  FAILED: "Failed", // Not meet the threshold
  INVALID: "Invalid", // Malicious encounter
};
export default TransactionStateEnum;
