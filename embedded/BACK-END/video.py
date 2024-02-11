import cv2
import os
from collections import defaultdict

# Path to the folder containing the images
folder_path = "uploads/192_168_0_116"

# Get a list of all files in the folder
files = os.listdir(folder_path)

# Initialize a dictionary to store images grouped by minute
images_by_minute = defaultdict(list)

# Iterate through all files in the folder
for file_name in files:
    # Split the file name by underscore
    parts = file_name.split('_')
    # Check if the file name has enough parts
    if len(parts) < 3:
        print(f"Skipping file {file_name}: Not enough parts")
        continue
    
    # Extract timestamp from the file name
    timestamp = parts[4]
    # Extract year, month, hour, and minute from the timestamp
    year = timestamp[:4]
    month = timestamp[4:6]
    hour = timestamp[8:10]
    minute = timestamp[10:12]
    
    # Construct the video name based on year, month, hour, and minute
    video_name = f"video_{year}_{month}_{hour}_{minute}.avi"
    
    # Add the file to the corresponding minute group
    images_by_minute[video_name].append(file_name)

# Iterate through each minute group and create videos
for video_name, image_files in images_by_minute.items():
    # Sort image files based on their timestamps
    image_files.sort()
    
    # Create video for the current minute
    video_path = os.path.join(folder_path, video_name)
    frame = cv2.imread(os.path.join(folder_path, image_files[0]))
    height, width, _ = frame.shape
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(video_path, fourcc, 20.0, (width, height))
    
    # Write each image to the video
    for img_name in image_files:
        img_path = os.path.join(folder_path, img_name)
        frame = cv2.imread(img_path)
        out.write(frame)
    
    # Release video writer
    out.release()
    print(f"Video created: {video_path}")