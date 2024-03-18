from zokrates_pycrypto.eddsa import PrivateKey, PublicKey
from functions import save_key,PRIVATE,PUBLIC
from server import PATH

sk = PrivateKey.from_rand()
pk = PublicKey.from_private(sk)

pk_hex = pk.p.compress().hex()
save_key(pk_hex,PATH + 'publicKeyBJJ.pem',PUBLIC)
# pk_read = read_key('publicKeyBJJ.pem')
# pk_hex_comp = pem_to_hex(pk_read,PUBLIC)
# print(pk_hex)
# print(pk_hex_comp)

sk_hex = hex(sk.fe.n)[2:]
save_key(sk_hex,PATH + 'privateKeyBJJ.pem',PRIVATE)