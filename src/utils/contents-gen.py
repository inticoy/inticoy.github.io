import os
import json
import argparse

def list_files_in_directories(base_path):
    directory_structure = {}
    categories = []
    
    for item in os.listdir(base_path):
        categories.append([item, os.path.join(base_path, item)])
    
    categories.sort()
    print(categories)
    
    for category, category_path in categories:
        if os.path.isdir(category_path):
            files = [{"title": f[11:], "date": f[:10], "category":category, "path":os.path.join(category_path, f)} for f in os.listdir(category_path) if os.path.isfile(os.path.join(category_path, f))]
            # files.sort()
            directory_structure[category] = files
    
    return directory_structure

def save_structure_as_json(structure, output_file):
    with open(output_file, 'w') as f:
        json.dump(structure, f, indent=4)





def main():
    # 파서 생성
    parser = argparse.ArgumentParser(description='Process some paths.')

    # base_path 인자 추가
    parser.add_argument('base_path', type=str, help='The base path for processing')

    # result_file 인자 추가
    parser.add_argument('result_file', type=str, help='The path for the result file')

    # 인자 파싱
    args = parser.parse_args()

    base_path = args.base_path
    output_file = args.result_file
    directory_structure = list_files_in_directories(base_path)
    save_structure_as_json(directory_structure, output_file)

if __name__ == '__main__':
    main()