from digitalSig import sign_bjj
from functions import *
from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

PATH = 'DummyData/'
PORT = 8061

@app.route('/', methods=['POST'])
def credit_report():
    user_data = request.json
    if validate_data(user_data):
        private_key = read_key(PATH + 'privateKeyBJJ.pem')
        credit_report = get_report(user_data)
        signature = sign_bjj(credit_report, private_key)
        credit_report['signature'] = signature
        save_json(credit_report,'response.json')
        return jsonify(credit_report)
    else:
        print("Data Invalid")
        return jsonify({'error': 'Data Invalid'}), 403

if __name__ == '__main__':
    app.run(port=PORT,host="0.0.0.0")