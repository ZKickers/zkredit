import json
import base64

def objToU8(x):
    json_str = json.dumps(x)
    return [str(ord(char)) for char in json_str]

def sigToU8(x):
    byte_array = base64.b64decode(x)
    return [str(int(byte)) for byte in byte_array]


with open("./Circuit/digsig/adapter/response.json", "r") as json_file:
    msg = json.load(json_file)

sig = msg["signature"]
del msg["signature"]

msg = objToU8(msg)
sig = sigToU8(sig)