from zokrates_pycrypto.eddsa import PrivateKey, FQ
from functions import pem_to_hex,PRIVATE,sha256Padded


def sign_bjj(msg,sk):
    sk_hex = pem_to_hex(sk,PRIVATE)
    sk_hex = int(sk_hex, 16)
    sk = PrivateKey(FQ(sk_hex))
    msg = sha256Padded(msg)
    print("Message Hex:",msg)
    (r_int, s_int) = sk.sign(bytes.fromhex(msg))
    S = hex(s_int)[2:]
    R = r_int.compress().hex()
    return {"R" : R , "S" : S}