import os
import re

html_files = [f for f in os.listdir('.') if f.endswith(('.html', '.htm'))]
for html_file in html_files:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('href="index.css"', 'href="assets/styles/index.css"')
    content = content.replace('href="login.css"', 'href="assets/styles/login.css"')
    content = content.replace('href="signup.css"', 'href="assets/styles/signup.css"')
    content = content.replace('href="menu.css"', 'href="assets/styles/menu.css"')
    content = content.replace('href="ajustes.css"', 'href="assets/styles/ajustes.css"')
    content = content.replace('href="alerta.css"', 'href="assets/styles/alerta.css"')
    content = content.replace('href="comunidad.css"', 'href="assets/styles/comunidad.css"')
    content = content.replace('href="riego.css"', 'href="assets/styles/riego.css"')
    content = content.replace('href="reportes.css"', 'href="assets/styles/reportes.css"')
    content = content.replace('href="usuarios.css"', 'href="assets/styles/usuarios.css"')
    
    content = content.replace('src="imagenes/', 'src="assets/images/')
    
    content = content.replace('src="index.css"', 'src="assets/scripts/index.js"')
    content = content.replace('src="login.js"', 'src="assets/scripts/login.js"')
    content = content.replace('src="signup.js"', 'src="assets/scripts/signup.js"')
    content = content.replace('src="menu.js"', 'src="assets/scripts/menu.js"')
    content = content.replace('src="ajustes.js"', 'src="assets/scripts/ajustes.js"')
    content = content.replace('src="alerta.js"', 'src="assets/scripts/alerta.js"')
    content = content.replace('src="comunidad.js"', 'src="assets/scripts/comunidad.js"')
    content = content.replace('src="riego.js"', 'src="assets/scripts/riego.js"')
    content = content.replace('src="reportes.js"', 'src="assets/scripts/reportes.js"')
    content = content.replace('src="usuarios.js"', 'src="assets/scripts/usuarios.js"')
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Actualizado: {html_file}')
