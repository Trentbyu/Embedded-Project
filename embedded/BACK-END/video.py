import os
from collections import defaultdict
from PIL import Image
from PIL import ImageDraw

# Path to the folder containing the images
folder_path = "uploads/192_168_0_116"  # Modify this path as needed

# Get a list of all files in the folder
files = os.listdir(folder_path)

# Initialize a dictionary to store images grouped by minute
images_by_minute = defaultdict(list)

# Iterate through all files in the folder
for file_name in files:
    # Split the file name by underscore
    parts = file_name.split('_')
    # Check if the file name has enough parts
    try:
        if len(parts) < 4 or parts[5] != 'esp32-cam.jpg':
            print(f"Skipping file {file_name}: Not enough parts or incorrect format")
            continue
    except:
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
    video_name = f"video_{year}_{month}_{day}_{hour}.gif"  # Using GIF format
    
    # Add the file to the corresponding minute group
    images_by_minute[video_name].append(file_name)

# Iterate through each minute group and create videos
for video_name, image_files in images_by_minute.items():
    # Sort image files based on their timestamps
    image_files.sort()
    
    # Create video for the current minute
    video_path = os.path.join(folder_path,"playback", video_name,)
    if not os.path.exists(folder_path,"playback"):
        os.makedirs(folder_path,"playback")
    # Create a list to store frames
    frames = []
    
    # Load each image and add it to frames list
    for img_name in image_files:
        img_path = os.path.join(folder_path, img_name)
        img = Image.open(img_path)
        draw = ImageDraw.Draw(img)
        draw.text((10, 10), img_name, fill="white")  # Add annotation with image name
        frames.append(img)
    
    # Save frames as an animated GIF
    frames[0].save(video_path, format='GIF', append_images=frames[1:], save_all=True, duration=300, loop=0)
    
    print(f"Video created: {video_path}")
