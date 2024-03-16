import json
import base64

def objToU8(x):
    json_str = json.dumps(x)
    return [str(ord(char)) for char in json_str]

def sigToU8(x):
    byte_array = base64.b64decode(x)
    return [str(int(byte)) for byte in byte_array]


with open("./Circuit/digsig/adapter/response.json", "r") as json_file:
    msg_og = json.load(json_file)

sig_og = msg_og["signature"]
del msg_og["signature"]

msg = objToU8(msg_og)
sig = sigToU8(sig_og)