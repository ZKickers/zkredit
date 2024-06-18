from digitalSig import sign_bjj
from functions import *
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from pathlib import Path


app = Flask(__name__)
CORS(app)

PATH = 'DummyData/'
PORT = 8061

@app.route('/', methods=['POST'])
def credit_report():
    user_data = request.json
    dummy_user = read_json(PATH + 'dummyUser.json')
    if compare_data(user_data, dummy_user):
        private_key = read_key(PATH + 'privateKeyBJJ.pem')
        dummy_report = read_json(PATH + 'dummyReport.json')
        signature = sign_bjj(dummy_report, private_key)
        dummy_report['signature'] = signature
        save_json(dummy_report,'response.json')
        return jsonify(dummy_report)
    else:
        print("mismatch")
        return jsonify({'error': 'Data mismatch'}), 403

if __name__ == '__main__':
    app.run(port=PORT,host="0.0.0.0")
