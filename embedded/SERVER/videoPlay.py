import cv2
import requests
import numpy as np
import datetime
import os
import time

def download_image(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            nparr = np.frombuffer(response.content, np.uint8)
            # Decode the image
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            return image
        else:
            print("Failed to download image from:", url)
            return None
    except Exception as e:
        print("Error downloading image:", e)
        return None

def fetch_elements():
    try:
        response = requests.get('http://127.0.0.1:8000/api/elements/')
        response.raise_for_status()  # Raise an error for non-200 status codes
        elements = response.json()  # Convert response to JSON
        image_viewer_ips = {element['ip_address']: os.path.join("videos", element['ip_address']) for element in elements if element.get('element_type') == 'ImageViewer'}
        return image_viewer_ips   # Extract IP addresses
    except requests.exceptions.RequestException as e:
        print('Error fetching elements:', e)
        return {}

# Create directory if it doesn't exist
if not os.path.exists("videos"):
    os.makedirs("videos")

# Your existing code
ip_addresses = fetch_elements()
image_buffer = {ip_address: [] for ip_address in ip_addresses}  # Dictionary to store images for each IP address
start_time = datetime.datetime.now()  # Initialize start time

try:
    while True:
        current_datetime = datetime.datetime.now()
        today = datetime.date.today()

        for ip_address in ip_addresses.keys():
            url = f'http://{ip_address}/video'

            # Download the image
            image = download_image(url)
            # time.sleep(1)
            if image is not None:
                # Append image to buffer
                image_buffer[ip_address].append(image)
        time.sleep(1)
        # Check if 1 second has passed
        if (datetime.datetime.now() - start_time).total_seconds() >= 5:
            # Write images to video for each IP address if there are any images
            for ip_address, images in image_buffer.items():
                if images:
                    # Create folder for IP address if it doesn't exist
                    ip_folder = ip_addresses[ip_address]
                    if not os.path.exists(ip_folder):
                        os.makedirs(ip_folder)
                    
                    # Write images to video
                    video_name = f'video_{today}_{ip_address}.mp4'
                    height, width, _ = images[0].shape
                    video_path = os.path.join(ip_folder, video_name)
                    fourcc = cv2.VideoWriter_fourcc(*'avc1')  # Use avc1 codec for H.264 video

                    video = cv2.VideoWriter(video_path, fourcc, 1, (width, height))
                    for img in images:
                        video.write(img)
                    video.release()
                    print(f'Video {video_name} created for IP address {ip_address}.')
                    image_buffer[ip_address] = []  # Clear image buffer

            start_time = datetime.datetime.now()  # Reset start time

except KeyboardInterrupt:
    print("User stopped the loop with Ctrl+C")
