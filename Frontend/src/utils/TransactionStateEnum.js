
const TransactionStateEnum = {
    INSUFFICIENT: 'Insufficient',
    PENDING_THRESHOLD: 'Pending_Threshold',
    PENDING_PROOF: 'Pending_Proof',  // In FE only for handling UI
    PENDING_VALIDATION: 'Pending_Verification',
    SUCCESS: 'Success', // Meet the threshold
    FAIL: 'Fail',   // Not meet the threshold
}
export default TransactionStateEnum;