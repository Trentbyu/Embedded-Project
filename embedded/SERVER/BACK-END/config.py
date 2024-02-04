import json

# Function to get user input for a new component
def get_new_component():
    new_type = input("Enter type of the component: ")
    image_source_link = input("Enter image source link: ")
    esp_name = input("Enter ESPNAME: ")
    device = input("Enter Device: ")

    new_component = {
        "type": new_type,
        "props": {
            "imageSourceLink": image_source_link,
            "containerId": image_source_link,
            "ESPNAME": esp_name,
            "Device": device
        }
    }
    return new_component

# Read the existing JSON data from the file
existing_file = 'embedded\SERVER\FRONT-END\src\HomePage.json'
with open(existing_file, 'r') as file:
    data = json.load(file)

# Get user input for each item to append
while True:
    add_more = input("Do you want to add a new component? (yes/no): ").lower()
    if add_more != 'yes':
        break
    new_component = get_new_component()
    data['components'].append(new_component)

# Write the updated JSON data back to the file
with open(existing_file, 'w') as file:
    json.dump(data, file, indent=4)
