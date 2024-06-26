import re

MSG_BYTES_LIMITS = {
    "fullname": 70,
    "address": 100,
    "birthdate": 10,
    "ssn": 9,
    "score": 2,
    "timestamp" : 8
}

LAMBDA_MSG_HEX_CHECKS = {
    "fullname": lambda hex_x: len(hex_x)//2 <= MSG_BYTES_LIMITS["fullname"],
    "address": lambda hex_x: len(hex_x)//2 <= MSG_BYTES_LIMITS["address"],
    "birthdate": lambda x: re.compile(r'^\d{2}-\d{2}-\d{4}$').match(x),
    "ssn": lambda x: re.compile(r'^\d{9}$').match(x)
}

REQUEST_PARAMS = ['fullname', 'address', 'birthdate', 'ssn']

DEFAULT_SCORE = 800