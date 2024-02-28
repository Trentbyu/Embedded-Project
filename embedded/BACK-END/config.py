from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from flask_cors import cross_origin
import os
# import cv2
import json  # Import the json module
from datetime import datetime
app = Flask(__name__)
CORS(app)
# os.chdir('c:\\Users\\trent\\OneDrive\\Documents\\GitHub\\Embedded-Project\\')
# Read the existing JSON data from the file
existing_file = os.path.join('embedded',  'FRONT-END', 'src', 'HomePage.json')
UPLOAD_FOLDER = 'uploads'

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
# Check if the file exists

if os.path.exists(existing_file):
    print("File exists!")
else:
    # /home/trent/Embedded-Project/embedded/SERVER/FRONT-END/src
    # user = input("whats the user ")
    # existing_file = os.path.join('/home','trent', 'Embedded-Project', 'embedded', 'SERVER', 'FRONT-END', 'src', 'HomePage.json')
    existing_file = "/home/trent/Embedded-Project/embedded/FRONT-END/src/HomePage.json"
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

@app.route('/api/components/<string:name>', methods=['DELETE'])
@cross_origin(methods=['DELETE'])
def delete_component(name):
    found = False
    for component in data['components']:
        if component['props']['ESPNAME'] == name:
            data['components'].remove(component)
            found = True
            break
    
    if found:
        with open(existing_file, 'w') as file:
            json.dump(data, file, indent=4)
        return jsonify({'message': f'Component {name} deleted'}), 200
    else:
        return jsonify({'error': f'Component {name} not found'}), 404


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
    
    if 'imageFile' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['imageFile']
    if image_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Get the IP address of the sender and replace '.' with '_'
    sender_ip = request.remote_addr.replace('.', '_')

    # Generate timestamp
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    # Save the image file with sender IP and timestamp appended to filename
    filename = f"{sender_ip}_{timestamp}_{image_file.filename}"

    if not os.path.exists(os.path.join(UPLOAD_FOLDER, sender_ip)):
        os.makedirs(os.path.join(UPLOAD_FOLDER, sender_ip))

    save_path = os.path.join(UPLOAD_FOLDER,sender_ip, filename)
    try:
        image_file.save(save_path)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    return jsonify({'message': 'Image saved successfully', 'path': save_path}), 200

@app.route('/gif')
def get_gif():
    # Get the argument from the URL query parameters
    argument = request.args.get('argument')
    ip_address = request.args.get('ip_address')
    # Path to your GIF file based on the argument
    ip_address_formatted = ip_address.replace('.', '_')  # Convert underscores to dots

    gif_path = fr'/home/trent/Embedded-Project/embedded/BACK-END/uploads/{ip_address_formatted}/playback/{argument}'

    # Send the GIF file
    return send_file(gif_path, mimetype='image/gif')

    
@app.route('/mp4')
def get_mp4():
    # Get the argument from the URL query parameters
    argument = request.args.get('argument')
    ip_address = request.args.get('ip_address')
    # Path to your MP4 file based on the argument
    ip_address_formatted = ip_address.replace('.', '_')  # Convert underscores to dots

    mp4_path = fr'/home/trent/Embedded-Project/embedded/BACK-END/uploads/{ip_address_formatted}/playback/{argument}'
    
    # Send the MP4 file
    return send_file(mp4_path, mimetype='video/mp4')


@app.route('/playback_files')
def get_playback_files():
    ip_address = request.args.get('ip_address')
    if ip_address is None:
        return jsonify(error="IP address parameter is missing"), 400
    print(ip_address)
    # Assuming ip_address is in the format '192_168_0_156'
    ip_address_formatted = ip_address.replace('.', '_')  # Convert underscores to dots
    playback_folder = fr'/home/trent/Embedded-Project/embedded/BACK-END/uploads/{ip_address_formatted}/playback'
    files = os.listdir(playback_folder)
    return jsonify(files)

import json

@app.route('/api/save_float', methods=['POST'])
def save_float():
    # Check if 'floatValue' is provided in the request data
    if 'floatValue' not in request.json:
        return jsonify({'error': 'No float value provided'}), 400

    # Get the float value from the request
    float_value = request.json['floatValue']

    # Get the IP address of the sender and replace '.' with '_'
    sender_ip = request.remote_addr.replace('.', '_')

    # Generate timestamp
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    # Create a dictionary to hold the data
    data = {
        'sender_ip': sender_ip,
        'timestamp': timestamp,
        'float_value': float_value
    }

    # Save the data to a JSON file
    filename = f"{sender_ip}_{timestamp}_data.json"
    save_path = os.path.join(UPLOAD_FOLDER, sender_ip, filename)
    try:
        with open(save_path, 'w') as json_file:
            json.dump(data, json_file)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    return jsonify({'message': 'Float value saved successfully', 'path': save_path}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0')
    # app.run(debug=True)


