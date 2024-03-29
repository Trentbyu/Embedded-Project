import os
import subprocess

# Directory containing folders you want to process
directory = 'uploads'

# Iterate over directories in the given directory
for folder in os.listdir(directory):
    # Construct the path to the current folder
    folder_path = os.path.join(directory, folder)
    
    # Check if the item in the directory is indeed a directory
    if os.path.isdir(folder_path):
        # Run your script with the folder as an argument using subprocess
        subprocess.run(['python3', 'video.py', folder_path])
