const ERROR_MSG = {
    userNotFound : 'User not found',
    txNotFound : 'Transaction not found',
    invalidToken : "Invalid Token",
    noToken : 'Access denied. Token is required.',
    signup : {
        param : 'Username, email, and password are required',
        userTaken : 'Username is already taken',
        emailTaken : 'Email is already registered',
        emailInvalid : 'Invalid email format',
        weakPassword : 'Password must be at least 7 characters long and contain at least one uppercase letter, one lowercase letter, and one special character',
        unexpected : "Couldn't signup. Please try again."
    },
    login : {
        invalidPassword : 'Invalid password',
        unexpected : "Couldn't login. Please Try again.",
    },
    getTx : {
        unexpected : "Couldn't get transaction. Please Try refreshing.",
    },
    deleteTx : {
        unauth : 'Forbidden: You are not authorized to delete this transaction',
        unexpected : "Couldn't delete transaction. Please try again."
    },
    deleteTxAll : {
        unauth : 'Forbidden: You are not authorized to delete these transactions',
        unexpected : "Couldn't delete transactions. Please try again."
    },
    issueTx : {
        unexpected : "Couldn't issue transaction. Please try again."
    },
    genProof : {
        wrongStatus : 'Transaction is not Pending_Client_Data',
        dataInvalid : "You entered invalid data. Please recheck your data before submitting.",
        unexpected : "Couldn't generate proof. Please re-enter your data and try again."
    },
    triggerThres : {
        outOfBound : "Threshold is not within (350-850)",
        unauth : 'Forbidden: You are not authorized to verify transaction',
        wrongStatus : "Transaction is not Pending_Threshold",
        unexpected : "Threshold didn't reach server. Please re-enter it."
    },
    getPRoof : {
        unauth : 'Forbidden: You are not authorized to verify transaction',
        wrongStatus : 'Could not get proof due to transaction status',
        unexpected : 'Getting Proof failed. Refreash and try again please.'
    },
    confirmVerify : {
        param : "Invalid Parameters",
        unauth : 'Forbidden: You are not authorized to verify transaction',
        wrongStatus : "Transaction is not Pending_Verification",
        unexpected : 'Proof Status did not reach server. Refreash and try again please.'
    }
}

module.exports = { ERROR_MSG }

const action = "triggerThres"
console.log(ERROR_MSG[action]["unexpected"])