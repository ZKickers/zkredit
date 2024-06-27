import hashlib

def generate_file_hash(file_path, hash_algorithm='sha256'):
    hash_function = hashlib.new(hash_algorithm)
    with open(file_path, 'rb') as file:
        while chunk := file.read(8192):
            hash_function.update(chunk)
    return hash_function.hexdigest()

def compare_files(file_path1, file_path2, hash_algorithm='sha256'):
    hash1 = generate_file_hash(file_path1, hash_algorithm)
    hash2 = generate_file_hash(file_path2, hash_algorithm)
    return hash1 == hash2


