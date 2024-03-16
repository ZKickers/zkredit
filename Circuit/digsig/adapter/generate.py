from msg_handler import msg,sig_bytes
from pk_handler import public_key,A
import json
import ecdsa
R = [0,0]
R[0], S = ecdsa.util.sigdecode_der(sig_bytes, public_key.pubkey.order)

print(f"R: {R}")
print(f"S: {S}")
print(f"A: {A}")
# print(f"M: {msg}")
# data = [e,n,msg,sig]
# for i in data:
#     print(len(i))
# with open("digsig_input.json","w") as json_file:
#     json.dump(data, json_file, indent=4)