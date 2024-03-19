from zokrates_pycrypto.eddsa import PrivateKey, PublicKey
from functions import save_key,PRIVATE,PUBLIC
from server import PATH

sk = PrivateKey.from_rand()
pk = PublicKey.from_private(sk)

pk_hex_x = hex(pk.p[0].n)[2:]
pk_hex_y = hex(pk.p[1].n)[2:]
save_key(pk_hex_x,PATH + 'publicKeyBJJ_X.pem',PUBLIC)
save_key(pk_hex_y,PATH + 'publicKeyBJJ_Y.pem',PUBLIC)
# pk_read = read_key('publicKeyBJJ.pem')
# pk_hex_comp = pem_to_hex(pk_read,PUBLIC)
# print(pk_hex)
# print(pk_hex_comp)

sk_hex = hex(sk.fe.n)[2:]
save_key(sk_hex,PATH + 'privateKeyBJJ.pem',PRIVATE)