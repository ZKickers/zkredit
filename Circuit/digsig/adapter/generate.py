from msg_handler import msg,sig
from pk_handler import n,e
import json

data = [e,n,msg,sig]
for i in data:
    print(len(i))
with open("digsig_input.json","w") as json_file:
    json.dump(data, json_file, indent=4)

