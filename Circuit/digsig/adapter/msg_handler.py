import json
import base64

def objToU8(x):
    return [str(ord(char)) for char in x]


def read_message_from_json(json_file):
    with open(json_file, 'r') as f:
        obj = json.load(f)
        return json.dumps(obj, separators=(',', ':'))


with open("./Circuit/digsig/adapter/response.json", "r") as json_file:
    msg_og = json.load(json_file)

sig_og = msg_og["signature"]
del msg_og["signature"]
msg_og = json.dumps(msg_og, separators=(',', ':'))

msg = objToU8(msg_og)
sig_bytes = base64.b64decode(sig_og)
