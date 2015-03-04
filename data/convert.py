"""
Make sure data TXT files are encoded in UTF-8 without BOM.
"""

import json, os

paths = filter(lambda p: '.txt' in p, os.listdir('.'))
names = []
for path in paths:
    artworks = []
    with open(path) as file:
        lines = file.readlines()
        name = lines.pop(0).strip()
        names.append(name)
        lines.pop(0)  # Empty line
        while lines:
            artwork = {}
            artwork['title'] = lines.pop(0).strip()
            artwork['artist'] = lines.pop(0).strip()
            artwork['date'] = lines.pop(0).strip()
            artwork['url'] = lines.pop(0).strip()
            if lines and lines[0]:
                lines.pop(0)  # Empty line
            artworks.append(artwork)
    output = {'artworks': artworks, 'name': name}
    with open(path.replace('.txt', '.json'), 'w') as file:
        file.write(json.dumps(output, indent=4, separators=(',', ': ')))
with open('index.json', 'w') as file:
    json_paths = [path.replace('.txt', '.json') for path in paths]
    file.write(json.dumps(dict(zip(names, json_paths)), indent=4, separators=(',', ': ')))