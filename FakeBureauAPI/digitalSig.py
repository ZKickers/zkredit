from zokrates_pycrypto.eddsa import PrivateKey, FQ, Point
from functions import pem_to_hex,PRIVATE,sha256Padded,conc_json

def decompress_point(p):
    p = Point.decompress(bytes.fromhex(p))
    return [p.x.n,p.y.n]

def sign_bjj(msg,sk):
    sk_hex = pem_to_hex(sk,PRIVATE)
    sk_hex = int(sk_hex, 16)
    sk = PrivateKey(FQ(sk_hex))
    msg = conc_json(msg)
    msg = sha256Padded(msg)
    print("Message Hex:",msg)
    (r_int, s_int) = sk.sign(bytes.fromhex(msg))
    S = hex(s_int)[2:]
    R = [hex(r.n)[2:] for r in r_int]
    return {"R" : R , "S" : S}