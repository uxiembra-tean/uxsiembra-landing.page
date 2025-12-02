import os

css_files = [f for f in os.listdir('.') if f.endswith('.css')]
for css_file in css_files:
    with open(css_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('imagenes/', '../images/')
    
    with open(css_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Actualizado: {css_file}')
