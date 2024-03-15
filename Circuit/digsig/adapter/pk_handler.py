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

n = intToU8(public_key.public_numbers().n)
e = intToU8(public_key.public_numbers().e)