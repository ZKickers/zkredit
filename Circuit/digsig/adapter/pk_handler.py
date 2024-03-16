import ecdsa

def read_public_key_from_pem(pem_file):
    with open(pem_file, 'r') as f:
        pem_data = f.read()
        return ecdsa.VerifyingKey.from_pem(pem_data)

def extract_A(public_key):
    return [int(public_key.pubkey.point.x()), int(public_key.pubkey.point.y())]

public_key_file = './Circuit/digsig/adapter/publicKey.pem'

public_key = read_public_key_from_pem(public_key_file)

A = extract_A(public_key)
