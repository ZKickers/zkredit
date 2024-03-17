const fs = require("fs")

const data = fs.readFileSync('response.json', 'utf8');
const obj = JSON.parse(data);
const { signature, ...json_msg } = obj;
const msg = Array.from(JSON.stringify(json_msg)).map(char => char.charCodeAt(0).toString());
const {r , s } = signature
const R = r.map(int => int.toString());
const S = s.toString()
module.exports = {R, S, msg}