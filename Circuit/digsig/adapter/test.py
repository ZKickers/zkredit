from pk_handler import e_og,n_og
from msg_handler import msg_og,sig_og

import hashlib
import base64

msg_bytes = bytes(str(msg_og), 'utf-8')
msg_hash = hashlib.sha256(msg_bytes).digest() 
print("Hash of message:", msg_hash.hex())

sig_bytes = base64.b64decode(sig_og)
sig_int = int.from_bytes(sig_bytes, byteorder='big')
sig_power = pow(sig_int, e_og, n_og)
print("Signature power:", hex(sig_power))