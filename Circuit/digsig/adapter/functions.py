import json
import base64
import textwrap

PUBLIC = "PUBLIC KEY"
PRIVATE = "PRIVATE KEY"

def pem_to_hex(pem_key,key_type):
    pem_header = f"-----BEGIN {key_type}-----\n"  
    pem_footer = f"\n-----END {key_type}-----"    
    base64_content = pem_key.replace(pem_header, '').replace(pem_footer, '').strip()
    binary_data = base64.b64decode(base64_content)
    hex_data = binary_data.hex()
    return hex_data

def save_key(hex_key, path, key_type):
    binary_data = bytes.fromhex(hex_key)
    base64_encoded_data = base64.b64encode(binary_data)
    formatted_base64_data = "\n".join(textwrap.wrap(base64_encoded_data.decode(), 64))
    pem_content = f"-----BEGIN {key_type}-----\n{formatted_base64_data}\n-----END {key_type}-----\n"
    with open(path, 'w') as pem_file:
        pem_file.write(pem_content)


def compare_data(request_data, user_data):
    return (
        request_data['fullname'] == user_data['fullname'] and
        request_data['address'] == user_data['address'] and
        request_data['birthdate'] == user_data['birthdate'] and
        request_data['ssn'] == user_data['ssn']
    )

def read_key(pem_path):
    with open(pem_path, 'r') as f: return f.read()

def read_json(json_path):
    with open(json_path, 'r') as f: return json.load(f)

def save_json(data,path):
    with open(path, 'w') as f: json.dump(data,f,indent=4)

def json_to_str(obj):
    return json.dumps(obj,separators=(',', ':'))

def ascii_to_hex(text):
    return ''.join(format(ord(char), '02x') for char in text)

def str_to_intArr(str):
    return [ord(char) for char in str]

def u8_to_u32(u8Array):
    while len(u8Array) % 4 != 0:
        u8Array.append(0)
    u32Array = []
    for i in range(0, len(u8Array), 4):
        value = (u8Array[i] << 24) | (u8Array[i+1] << 16) | (u8Array[i+2] << 8) | u8Array[i+3]
        u32Array.append(str(value))
    return u32Array