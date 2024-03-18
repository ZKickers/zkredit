from zokrates_pycrypto.eddsa import PrivateKey, FQ
from functions import pem_to_hex,PRIVATE


def sign_bjj(msg,sk):
    sk_hex = pem_to_hex(sk,PRIVATE)
    sk_hex = int(sk_hex, 16)
    sk = PrivateKey(FQ(sk_hex))
    msg = msg.encode('utf8')
    print("Message Hex:",msg.hex())
    (r_int, s_int) = sk.sign(msg)
    S = hex(s_int)[2:]
    R = r_int.compress().hex()
    return {"R" : R , "S" : S}