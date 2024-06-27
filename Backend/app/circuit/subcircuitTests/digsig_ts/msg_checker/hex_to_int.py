import json

def read_array_from_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    return content.split(',')

def save_array_to_jsonfile(array, file_path):
    with open(file_path, 'w') as file:
        json.dump(array,file, indent=4)

def hextext_to_json(input_path,output_path):
    msg = read_array_from_file("msg.txt")
    for i in range(len(msg)):
        msg[i] = int(msg[i], 16)
        msg[i] = str(msg[i])
    save_array_to_jsonfile(msg,"new_msg.json")

