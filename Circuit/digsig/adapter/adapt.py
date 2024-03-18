from functions import *
from zokrates_pycrypto.eddsa import FQ,Point

def decompress_point(p):
    p = Point.decompress(bytes.fromhex(p))
    return [p.x.n,p.y.n]

resp = read_json('response.json')
r = resp['signature']['R']
R = decompress_point(r)
print("R:",R)

S = int(resp['signature']['S'],16)
print("S:",S)

a = read_key('publicKeyBJJ.pem')
a = pem_to_hex(a,PUBLIC)
A = decompress_point(a)
print("A:",A)

msg = resp
del msg['signature']
msg = json_to_str(msg)
msg = str_to_intArr(msg)
print("Msg:",msg)

data = [R,S,A,msg]
save_json(data,'digsig_test.json')