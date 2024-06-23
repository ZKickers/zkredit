import json
import base64
import textwrap
import hashlib
import time
from config import LAMBDA_MSG_LIMITS, REQUEST_PARAMS, DEFAULT_SCORE



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


def validate_data(request_data):
    if len(request_data) != len(REQUEST_PARAMS):
        return False
    for param in REQUEST_PARAMS:
        item = request_data[param]
        if not item or not LAMBDA_MSG_LIMITS[param](item):
            return False
    return True

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

def sha256Padded(msg):
    input_bytes = msg.encode('utf-8')
    sha256_hash = hashlib.sha256()
    sha256_hash.update(input_bytes)
    hash = sha256_hash.hexdigest()
    padded_hash = hash + '0' * 64
    return padded_hash

def conc_msg(msg,limits):
    res = ""
    for key, value in msg.items():
        val = ""
        if isinstance(value, int):
            val += int_to_ascii(value)
        elif isinstance(value, str):
            val += value
        while (len(val)<limits[key]):
            val += '\0'
        res += val
    return res

def int_to_ascii(num):
    ascii_chars = ''
    while num > 0:
        ascii_chars = chr(num % 256) + ascii_chars
        num //= 256
    return ascii_chars

def str_to_intArr(input_string):
    return [str(ord(char)) for char in input_string]

def get_report(user_data):
    user_data['score'] = DEFAULT_SCORE
    return user_data

def stick_ts(msg):
    msg['timestamp'] = int(time.time()*1000)
    return msg
