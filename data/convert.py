import json, os

paths = filter(lambda p: '.txt' in p, os.listdir('.'))
for path in paths:
    artworks = []
    with open(path) as file:
        lines = file.readlines()
        while lines:
            artwork = {}
            artwork['title'] = lines.pop(0).strip()
            artwork['artist'] = lines.pop(0).strip()
            artwork['date'] = lines.pop(0).strip()
            artwork['url'] = lines.pop(0).strip()
            if lines and lines[0]:
                lines.pop(0)  # Empty line
            artworks.append(artwork)
    output = {'artworks': artworks}
    with open(path.replace('.txt', '.json'), 'w') as file:
        file.write(json.dumps(output, indent=4, separators=(',', ': ')))

    