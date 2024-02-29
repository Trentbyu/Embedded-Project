import os
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import json  # Import the json module

def plot_and_save(data, save):
    try:
        # Filter data for the last hour
        current_time = datetime.now()
        one_hour_ago = current_time - timedelta(hours=1)
        filtered_data = [entry for entry in data if datetime.strptime(entry['timestamp'], "%Y%m%d%H%M%S") >= one_hour_ago]

        timestamps = [entry['timestamp'] for entry in filtered_data]
        float_values = [entry['float_value'] for entry in filtered_data]

        # Convert timestamps to datetime objects
        timestamps = [datetime.strptime(ts, "%Y%m%d%H%M%S") for ts in timestamps]

        # Plotting
        plt.figure(figsize=(10, 6))
        plt.plot(timestamps, float_values, marker='o')
        plt.xlabel('Timestamp')
        plt.ylabel('Temp')
        plt.title('Temp vs Time (Last Hour)')
        plt.grid(True)

        # Save the plot as an image
        save += "plot.png"
        
        print("Plot path:", save)  # Debugging: Print plot path
        plt.savefig(save)
        plt.close()  # Close the plot to free up memory
        return save
    except Exception as e:
        print("Error:", e)  # Debugging: Print error message
        return None

if __name__ == "__main__":
    # Define the directory where the JSON files are located
    json_directory = 'uploads'

    # Iterate through all files in the directory
    for filename in os.listdir(json_directory):
        # Check if the file ends with ".json"
        if filename.endswith(".json"):
            # Construct the full path of the JSON file
            json_file_path = os.path.join(json_directory, filename)

            # Read data from the JSON file
            try:
                print(json_file_path)
                with open(json_file_path, 'r') as file:
                    data = json.load(file)
            except Exception as e:
                print(f"Error reading data from file '{json_file_path}': {e}")
                continue

            # Generate a save name (you can modify this logic as needed)
            save_name = json_file_path[:-9] 
            print(save_name)

            # Call the plot_and_save function
            plot_path = plot_and_save(data, save_name)
            if plot_path:
                print(f"Plot saved at: {plot_path}")
            else:
                print("Failed to save plot for file:", json_file_path)
  