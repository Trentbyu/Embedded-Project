from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import os
import cv2
import json  # Import the json module

app = Flask(__name__)
CORS(app)

# Read the existing JSON data from the file
existing_file = os.path.join('embedded', 'SERVER', 'FRONT-END', 'src', 'HomePage.json')
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
    if 'imageFile' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['imageFile']
    if image_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Get the IP address of the sender and replace '.' with '_'
    sender_ip = request.remote_addr.replace('.', '_')

    # Save the image file with sender IP appended to filename
    filename = f"{sender_ip}_{image_file.filename}"
    save_path = os.path.join(UPLOAD_FOLDER, filename)
    try:
        image_file.save(save_path)

        # Perform face recognition on the saved image
        image = cv2.imread(save_path)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Load the pre-trained face detection model
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

        # Detect faces in the image
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        # Draw rectangles around the detected faces
        for (x, y, w, h) in faces:
            cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 0), 2)

        # Save the modified image
        cv2.imwrite(save_path, image)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    return jsonify({'message': 'Image saved successfully', 'path': save_path}), 200


@app.route('/api/get_image/<ip_address>', methods=['GET'])
def get_image(ip_address):
    image_path = fr'C:\Users\trent\OneDrive\Documents\GitHub\Embedded-Project\uploads\192_168_0_116_esp32-cam.jpg'

    if not os.path.exists(image_path):
        return jsonify({'error': 'Image not found'}), 404
    
    return send_file(image_path, mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(host='0.0.0.0')
    # app.run(debug=True)


