import os
import json

def list_files_in_directories(base_path):
    directory_structure = {}
    categories = []
    
    for item in os.listdir(base_path):
        categories.append([item, os.path.join(base_path, item)])
    
    categories.sort()
    print(categories)
    
    for category, category_path in categories:
        if os.path.isdir(category_path):
            files = [{"title": f, "date": f[:10], "category":category, "path":os.path.join(category_path, f)} for f in os.listdir(category_path) if os.path.isfile(os.path.join(category_path, f))]
            # files.sort()
            directory_structure[category] = files
    
    return directory_structure

def save_structure_as_json(structure, output_file):
    with open(output_file, 'w') as f:
        json.dump(structure, f, indent=4)

base_path = './content'

output_file = './content/contents.json'

directory_structure = list_files_in_directories(base_path)

save_structure_as_json(directory_structure, output_file)