from msg_handler import msg,sig
from pk_handler import n,e
import json

data = [e,n,msg,sig]
for d in data:
    print(len(d))
    print(d)
with open("digsig_input.json","w") as json_file:
    json.dump(msg, json_file, indent=4)