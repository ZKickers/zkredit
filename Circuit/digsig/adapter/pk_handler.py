from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
import json

def intToU8(x):
    x_bytes = x.to_bytes((x.bit_length() + 7) // 8, byteorder='big')
    return [str(int(byte)) for byte in x_bytes]

with open("./Circuit/digsig/adapter/publicKey.pem", "rb") as key_file:
    public_key = serialization.load_pem_public_key(
        key_file.read(),
        backend=default_backend()
    )

n_og = public_key.public_numbers().n
e_og = public_key.public_numbers().e
n = intToU8(n_og)
e = intToU8(e_og)
