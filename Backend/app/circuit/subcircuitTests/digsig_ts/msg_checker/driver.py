from hex_to_int import hextext_to_json
from file_content_chekcer import compare_files

input = "msg.txt"
output = "new_msg.json"
comp = "msg.json"

# hextext_to_json(input,output)
# print(compare_files(output,comp))

print(compare_files(input,'msg_new.txt'))