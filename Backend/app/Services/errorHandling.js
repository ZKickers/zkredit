export const ERROR_MSG = {
    "notFound" : 'User not found',
    "invalidToken" : "Invalid Token.",
    "signup" : {
        "param" : 'Username, email, and password are required',
        "userTaken" : 'Username is already taken',
        "emailTaken" : 'Email is already registered',
        "emailInvalid" : 'Invalid email format',
        "weakPassword" : 'Password must be at least 7 characters long and contain at least one uppercase letter, one lowercase letter, and one special character',
        "unexpected" : "Couldn't signup. Please try again."
    },
    "login" : {
        "invalidPassword" : 'Invalid password',
        "unexpected" : "Couldn't login. Please Try again.",
    },
    "getTx" : "unexpected",
    "deleteTx" : {
        "notFound" : "Transaction not found",
        "unauth" : 'Forbidden: You are not authorized to delete this transaction',
        "unexpected" : "Couldn't delete transaction. Please try again."
    },
    "deleteTxAll" : {
        "unauth" : 'Forbidden: You are not authorized to delete these transactions',
        "unexpected" : "Couldn't delete transactions. Please try again."
    }


}
