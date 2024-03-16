from pk_handler import e_og,n_og
from msg_handler import msg_og,sig_og
import hashlib
import base64

msg_bytes = bytes(msg_og,'utf-8')
msg_hash = hashlib.sha256(msg_bytes).digest() 
print("Hash of message:", msg_hash.hex())

sig_bytes = base64.b64decode(sig_og)
sig_int = int.from_bytes(sig_bytes, byteorder='big')
sig_power = pow(sig_int, e_og, n_og)
sig_power_bytes = bytes_data = sig_power.to_bytes((sig_power.bit_length() + 7) // 8, byteorder='big')
print("Signature power:", sig_power_bytes[-32:].hex())