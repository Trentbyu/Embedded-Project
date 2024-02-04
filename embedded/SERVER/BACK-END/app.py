from flask import Flask, render_template, Response
from flask_socketio import SocketIO
import cv2
from flask_cors import CORS
import requests
import numpy as np
import time 
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow all origins for SocketIO

# Replace this with your ESP32 camera URL
ESP32_CAMERA_URL = "http://192.168.0.116/video"

import time

def generate_frames():
    while True:
        response = requests.get(ESP32_CAMERA_URL)
        if response.status_code == 200:
            frame_bytes = response.content
            print(f"Received frame bytes: {len(frame_bytes)}")

            frame = cv2.imdecode(np.frombuffer(frame_bytes, np.uint8), -1)
            if frame is not None:
                print("Frame successfully decoded")

                ret, jpeg = cv2.imencode('.jpg', frame)
                if ret:
                    print("Frame successfully encoded")

                    jpeg_bytes = jpeg.tobytes()
                    socketio.emit('video_feed', {'frame': jpeg_bytes}, namespace='/video')
                    print('Frame sent to clients')
                else:
                    print("Error encoding frame")
            else:
                print("Error decoding frame")
        else:
            print(f"Error: Status Code {response.status_code}")

        # Add a delay to control the frame generation rate
        time.sleep(0.1)

if __name__ == '__main__':
    socketio.start_background_task(target=generate_frames)
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
