from zokrates_pycrypto.eddsa import PublicKey,Point,FQ
from functions import *

def verify_sig(R,S,M,pk):
    r_hex, s_hex = R, S
    msg = bytes.fromhex(M)
    pk_hex = pk
    pk = PublicKey(Point.decompress(bytes.fromhex(pk_hex)))
    r = Point.decompress(bytes.fromhex(r_hex))
    s = FQ(int(s_hex, 16))
    return pk.verify((r, s), msg)


resp = read_json('response.json')
R = resp['signature']['R']
print("R:",R)
S = resp['signature']['S']
print("S:",S)
msg = resp
del msg['signature']
msg = json_to_str(msg)
msg = ascii_to_hex(msg)
print("Msg:",msg)
pk = read_key('DummyData/publicKeyBJJ.pem')
pk = pem_to_hex(pk,PUBLIC)
print("PK:",pk)
print(verify_sig(R,S,msg,pk))