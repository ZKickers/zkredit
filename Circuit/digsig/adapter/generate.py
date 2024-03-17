from msg_handler import msg,sig_bytes
from pk_handler import public_key,A
from ecdsa import numbertheory
import json
import ecdsa
R = [0,0]
R[0], S = ecdsa.util.sigdecode_der(sig_bytes, public_key.pubkey.order)
p = 2**256 - 2**32 - 977
y_squared = (pow(R[0], 3, p) + 7) % p
try:
    R[1] = numbertheory.square_root_mod_prime(y_squared, p)
except ValueError:
    print("No y coordinate exists for the given x on the secp256k1 curve.")

curve = ecdsa.curves.SECP256k1.curve

test = ecdsa.ellipticcurve.Point(curve, R[0],R[1], True)

print(f"R: {R}")
print(f"S: {S}")
print(f"A: {A}")
# print(f"M: {msg}")
# data = [e,n,msg,sig]
# for i in data:
#     print(len(i))
# with open("digsig_input.json","w") as json_file:
#     json.dump(data, json_file, indent=4)