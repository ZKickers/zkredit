export function errlog (action, errorMsg) {
    console.error(`${action} failed with Error: ${errorMsg}`);
}

export function reqlog (action) {
    console.log(`${action} attempt`)
}

export function successLog(username,action) {
    console.log(`${username} successfull ${action}`)
}

export function paramsMissingLog(params) {
    console.log(`Missing required parameters :  ${params}`)
}

export function issueTxLog(tx,clientUsername) {
    const {_id, creditorUsername, fullNameOfClient} = tx
    console.log(`TX ${_id} created 
               | issuedBy : ${clientUsername}
               | using fullname : ${fullNameOfClient}
               | to : ${creditorUsername}`)
    txUpdateLog(tx._id,"Pending_Threshold")
}

export function txUpdateLog(txid,newS,oldS=null) {
    console.log(`Transaction ${txid} Status Update : ${oldS!==null ? `${oldS}-->` : ''} ${newS}`)
}