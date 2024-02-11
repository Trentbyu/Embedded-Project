import os
from collections import defaultdict
import imageio

# Path to the folder containing the images
folder_path = r"uploads\192_168_0_116"

# Get a list of all files in the folder
files = os.listdir(folder_path)

# Initialize a dictionary to store images grouped by minute
images_by_minute = defaultdict(list)

# Iterate through all files in the folder
for file_name in files:
    # Split the file name by underscore
    parts = file_name.split('_')
    # Check if the file name has enough parts
    if len(parts) < 4 and parts[5] == 'esp32-cam.jpg':
        print(f"Skipping file {file_name}: Not enough parts")
        continue
    
    # Extract timestamp from the file name
    timestamp = parts[4]
    # Extract year, month, hour, and minute from the timestamp
    year = timestamp[:4]
    month = timestamp[4:6]
    day = timestamp[6:8]
    hour = timestamp[8:10]
    minute = timestamp[10:12]
    second = timestamp[12:14]

    # Construct the video name based on year, month, hour, and minute
    video_name = f"video_{year}_{month}_{day}_{hour}_{minute}.mp4"
    
    # Add the file to the corresponding minute group
    images_by_minute[video_name].append(file_name)

# Iterate through each minute group and create videos
for video_name, image_files in images_by_minute.items():
    # Sort image files based on their timestamps
    image_files.sort()
    
    # Create video for the current minute
    video_path = os.path.join(folder_path, video_name)
    
    with imageio.get_writer(video_path, fps=10) as writer:
        # Write each image to the video
        for img_name in image_files:
            img_path = os.path.join(folder_path, img_name)
            img = imageio.imread(img_path)
            writer.append_data(img)
    
    print(f"Video created: {video_path}")
