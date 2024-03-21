from zokrates_pycrypto.eddsa import PrivateKey, FQ, Point
from functions import *

MSG_LIMITS = {
    "fullname": 70,
    "address": 100,
    "birthdate": 10,
    "ssn": 9,
    "score": 2
}

def decompress_point(p):
    p = Point.decompress(bytes.fromhex(p))
    return [p.x.n,p.y.n]

def sign_bjj(msg,sk):
    sk_hex = pem_to_hex(sk,PRIVATE)
    sk_hex = int(sk_hex, 16)
    sk = PrivateKey(FQ(sk_hex))
    msg = conc_msg(msg,MSG_LIMITS)
    save_json(str_to_intArr(msg),'msg.json')
    msg = sha256Padded(msg)
    print("Message Hex:",msg)
    (r_int, s_int) = sk.sign(bytes.fromhex(msg))
    S = hex(s_int)[2:]
    R = [hex(r.n)[2:] for r in r_int]
    print("a7eeh")
    print(R)
    print(S)
    return {"R" : R , "S" : S}