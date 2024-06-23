import re

MSG_LIMITS = {
    "fullname": 70,
    "address": 100,
    "birthdate": 10,
    "ssn": 9,
    "score": 2
}

LAMBDA_MSG_LIMITS = {
    "fullname": lambda x: len(x) <= 70,
    "address": lambda x: len(x) <= 100,
    "birthdate": lambda x: re.compile(r'^\d{2}-\d{2}-\d{4}$').match(x),
    "ssn": lambda x: re.compile(r'^\d{9}$').match(x)
}

REQUEST_PARAMS = ['fullname', 'address', 'birthdate', 'ssn']

DEFAULT_SCORE = 800