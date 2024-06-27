from zokrates_pycrypto.eddsa import PrivateKey, FQ, Point
from functions import *
from config import MSG_BYTES_LIMITS

def decompress_point(p):
    p = Point.decompress(bytes.fromhex(p))
    return [p.x.n,p.y.n]

def sign_bjj(msg,sk):
    sk_hex = pem_to_hex(sk,PRIVATE)
    sk_hex = int(sk_hex, 16)
    sk = PrivateKey(FQ(sk_hex))
    msg = stick_ts(msg)
    msg = conc_msg(msg,MSG_BYTES_LIMITS)
    save_json(msg,'msg_hex.json')
    save_json(hex_to_intArr(msg),'msg.json')
    print(bytes.fromhex(msg))
    msg = sha256Padded(bytes.fromhex(msg))
    save_json(msg,'msg_hash.json')
    (r_int, s_int) = sk.sign(bytes.fromhex(msg))
    S = hex(s_int)[2:]
    R = [hex(r.n)[2:] for r in r_int]
    return {"R" : R , "S" : S}