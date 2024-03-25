#!/usr/bin/env python3

import os
import json
import argparse
from datetime import datetime

def add_post(category, title):
    category_path = "./content/" + category
    post_title = datetime.now().strftime("%Y-%m-%d") + "-" + title + ".md"
    post_path = category_path + "/" + post_title

    if not os.path.exists(category_path):
        os.makedirs(category_path)
        print("Directory '{}' was created.".format(category_path))
    else:
        print("Directory '{}' already exists.".format(category_path))

    with open(post_path, 'w') as f:
        f.close()

    

def add_project(title):
    a = 1

def push_changes():
    base_path = "./content"
    output_path = "./content/contents.json"
    directory_structure = {}
    categories = []
    
    for item in os.listdir(base_path):
        categories.append([item, os.path.join(base_path, item)])
    
    categories.sort()
    
    for category, category_path in categories:
        if os.path.isdir(category_path):
            files = [{"title": f[11:], "date": f[:10], "category":category, "path":os.path.join(category_path, f)} for f in os.listdir(category_path) if os.path.isfile(os.path.join(category_path, f))]
            if len(files):
              print(files[0]["category"] + "/" + files[0]["title"])
            # files.sort()
            directory_structure[category] = files
    
    with open(output_path, 'w') as f:
        json.dump(directory_structure, f, indent=4)
    

def main():
    main_parser = argparse.ArgumentParser(description="Helper for adding articles and pushing changes.")
    
    # Setting up subparsers for the main parser
    subparsers = main_parser.add_subparsers(dest='cmd', help='Commands')
    
    # Parser for 'push' command
    parser_push = subparsers.add_parser('push', help='Push changes')

    # Adding a subparser for the 'add' command
    parser_add = subparsers.add_parser('add', help='Add a post or project')
    add_subparsers = parser_add.add_subparsers(dest='add_cmd', help='Add subcommands')
    
    # Subparser for adding a post
    parser_add_post = add_subparsers.add_parser('post', help='Add a new post')
    parser_add_post.add_argument('category', type=str, help='Category of the post')
    parser_add_post.add_argument('title', type=str, help='Title of the post')
    
    # Subparser for adding a project
    parser_add_project = add_subparsers.add_parser('project', help='Add a new project')
    parser_add_project.add_argument('title', type=str, help='Title of the project')
    
    # Parse the arguments
    args = main_parser.parse_args()
    
    # Handle the parsed arguments
    if args.cmd == 'add':
        if args.add_cmd == 'post':
            add_post(args.category, args.title)
        elif args.add_cmd == 'project':
            add_project(args.title)
    elif args.cmd == 'push':
        push_changes()
    else:
        main_parser.print_help()

if __name__ == '__main__':
    main()