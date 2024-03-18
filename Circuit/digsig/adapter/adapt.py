from functions import *
from zokrates_pycrypto.eddsa import FQ,Point

def decompress_point(p):
    p = Point.decompress(bytes.fromhex(p))
    return [p.x.n,p.y.n]

resp = read_json('response.json')
r = resp['signature']['R']
R = decompress_point(r)
R = [str(i) for i in R]
print("R:",R)

S = str(int(resp['signature']['S'],16))
print("S:",S)

a = read_key('publicKeyBJJ.pem')
a = pem_to_hex(a,PUBLIC)
A = decompress_point(a)
A = [str(i) for i in A]
print("A:",A)

msg = resp
del msg['signature']
msg = json_to_str(msg)
msg = str_to_intArr(msg)
M1 = msg[:32]
M1 = u8_to_u32(M1)
print(f"M1: {M1}")
M2 = msg[-32:]
M2 = u8_to_u32(M2)
print(f"M2: {M2}")

data = [R,S,A,M1,M2]
save_json(data,'digsig_test.json')