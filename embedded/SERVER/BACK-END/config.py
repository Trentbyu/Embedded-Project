from flask import Flask, jsonify, request
from flask_cors import CORS
import os

import json  # Import the json module

app = Flask(__name__)
CORS(app)

# Read the existing JSON data from the file
existing_file = os.path.join('embedded', 'SERVER', 'FRONT-END', 'src', 'HomePage.json')

# Check if the file exists

if os.path.exists(existing_file):
    print("File exists!")
else:
    # /home/trent/Embedded-Project/embedded/SERVER/FRONT-END/src
    # user = input("whats the user ")
    # existing_file = os.path.join('/home','trent', 'Embedded-Project', 'embedded', 'SERVER', 'FRONT-END', 'src', 'HomePage.json')
    existing_file = "/home/trent/Embedded-Project/embedded/SERVER/FRONT-END/src/HomePage.json"
    print("File does not exist.")


with open(existing_file, 'r') as file:
    data = json.load(file)

@app.route('/api/components', methods=['GET'])
def get_components():
    return jsonify(data['components'])

@app.route('/api/components', methods=['POST'])
def add_component():
    new_component = request.json
    data['components'].append(new_component)
    with open(existing_file, 'w') as file:
        json.dump(data, file, indent=4)
    return jsonify(new_component), 201

@app.route('/api/components/<int:index>', methods=['DELETE'])
def delete_component(index):
    if 0 <= index < len(data['components']):
        del data['components'][index]
        with open(existing_file, 'w') as file:
            json.dump(data, file, indent=4)
        return jsonify({'message': 'Component deleted'}), 200
    else:
        return jsonify({'error': 'Invalid index'}), 404

@app.route('/api/components/order', methods=['PUT'])
def update_component_order():
    new_order = request.json
    print("Received order:", new_order)  # Add this line to print received data
    if 'components' in new_order:
        data['components'] = new_order['components']
        with open(existing_file, 'w') as file:
            json.dump(data, file, indent=4)
        return jsonify({'message': 'Component order updated'}), 200
    else:
        return jsonify({'error': 'Invalid request format'}), 400
if __name__ == '__main__':
    app.run(host='0.0.0.0')
    # app.run(debug=True)


