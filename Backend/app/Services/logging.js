function errlog (action, errorMsg) {
    console.error(`${action} failed with Error: ${errorMsg}`);
}

function reqlog (action) {
    console.log(`${action} attempt`)
}

function successLog(username,action) {
    console.log(`${username} - ${action} { Success }`)
}

function paramsMissingLog(params) {
    console.log(`Missing required parameters :  ${params}`)
}

function issueTxLog(tx,clientUsername) {
    const {_id, creditorUsername, fullNameOfClient} = tx
    console.log(`TX ${_id} created 
               | issuedBy : ${clientUsername}
               | using fullname : ${fullNameOfClient}
               | to : ${creditorUsername}`)
    txUpdateLog(tx._id,"Pending_Threshold")
}

function txUpdateLog(txid,newS,oldS=null) {
    console.log(`TX ${txid} Status Update : ${oldS!==null ? `${oldS}-->` : ''} ${newS}`)
}

function inProgLog(action){
    console.log(`${action} in progress . . .`)
}

module.exports = { issueTxLog, successLog, txUpdateLog, paramsMissingLog, reqlog, errlog, inProgLog}