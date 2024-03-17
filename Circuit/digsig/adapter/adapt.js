const pk = require("./pk_handler")
const resp = require("./msg_handler")
const fs = require("fs")

const data = [resp.R, resp.S, pk.A, resp.msg]
console.log("Msg Length:",resp.msg.length)
const jsonString = JSON.stringify(data, null, 4);
fs.writeFileSync('digsig_test.json', jsonString, 'utf8');