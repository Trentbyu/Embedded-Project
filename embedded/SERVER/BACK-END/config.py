from flask import Flask, jsonify, request, send_file
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
    # print("Received order:", new_order)  # Add this line to print received data
    if 'components' in new_order:
        data['components'] = new_order['components']
        with open(existing_file, 'w') as file:
            json.dump(data, file, indent=4)
        return jsonify({'message': 'Component order updated'}), 200
    else:
        return jsonify({'error': 'Invalid request format'}), 400
    
@app.route('/api/save_image', methods=['POST'])
def save_image():
    image_data = request.data
    if not image_data:
        return jsonify({'error': 'No image data provided'}), 400
    
    ip_address = request.remote_addr.replace('.', '_')  # Get the client IP address and replace dots with underscores
    save_path = f'image_{ip_address}.jpg'  # Save the image with IP address in the file name
    
    try:
        with open(save_path, 'wb') as f:
            f.write(image_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    return jsonify({'message': 'Image saved successfully', 'path': save_path}), 200

@app.route('/api/get_image/<ip_address>', methods=['GET'])
def get_image(ip_address):
    image_path = fr'C:\Users\trent\OneDrive\Documents\GitHub\Embedded-Project\image_192_168_0_100.jpg'

    if not os.path.exists(image_path):
        return jsonify({'error': 'Image not found'}), 404
    
    return send_file(image_path, mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(host='0.0.0.0')
    # app.run(debug=True)


