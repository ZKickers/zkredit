const TransactionStateEnum = {
  INSUFFICIENT: "Insufficient",
  PENDING_THRESHOLD: "Pending_Threshold",
  PENDING_PROOF: "Pending_Proof",
  PENDING_VERIFICATION: "Pending_Verification",
  PENDING_CLIENT_DATA: "Pending_Client_Data",
  SUCCESS: "Success", // Meet the threshold
  FAIL: "Fail", // Not meet the threshold
};
export default TransactionStateEnum;
