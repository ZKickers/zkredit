const pk = require("./pk_handler")
const resp = require("./msg_handler")

A = pk.A_big
R = resp.r.map(int => BigInt(int));
S = BigInt(resp.s);
M = resp.json_msg;

