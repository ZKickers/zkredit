export function errlog (action, errorMsg) {
    console.error(`${action} failed with Error: ${errorMsg}`);
}

export function reqlog (action) {
    console.log(`${action} attempt`)
}

export function successLog(username,action) {
    console.log(`${username} successfull ${action}`)
}