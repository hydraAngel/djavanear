import os
import json
import numpy as np
from PIL import Image
from sklearn.cluster import KMeans

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def calculate_luminance(color):
    r, g, b = [x/255.0 for x in color]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast_ratio(color1, color2):
    l1 = calculate_luminance(color1)
    l2 = calculate_luminance(color2)
    return (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)

def adjust_for_contrast(base_color, bg_color, min_ratio=4.5):
    original_base = base_color
    for _ in range(20):  # Limite de tentativas
        ratio = contrast_ratio(base_color, bg_color)
        if ratio >= min_ratio:
            return base_color
        # Escurecer se muito claro, clarear se muito escuro
        if calculate_luminance(base_color) > calculate_luminance(bg_color):
            base_color = tuple(max(0, c - 15) for c in base_color)
        else:
            base_color = tuple(min(255, c + 15) for c in base_color)
    return original_base  # Fallback

def get_dominant_colors(image_path, num_colors=4):
    image = Image.open(image_path).convert('RGB')
    img_array = np.array(image.resize((150, 150)))
    pixels = img_array.reshape(-1, 3)
    
    kmeans = KMeans(n_clusters=num_colors, n_init=10)
    kmeans.fit(pixels)
    
    counts = np.bincount(kmeans.labels_)
    colors = kmeans.cluster_centers_
    return [tuple(map(int, color)) for color in colors[np.argsort(-counts)]]

def generate_accessible_colors(dominant_colors):
    primary = dominant_colors[0]
    bg_color = dominant_colors[1] if len(dominant_colors) > 1 else primary
    
    # Garantir contraste entre texto e fundo
    text_color = (30, 30, 30) if calculate_luminance(bg_color) > 0.5 else (240, 240, 240)
    text_color = adjust_for_contrast(text_color, bg_color)
    
    # Cor de destaque com contraste contra o fundo
    accent_color = dominant_colors[2] if len(dominant_colors) > 2 else primary
    accent_color = adjust_for_contrast(accent_color, bg_color, min_ratio=3)
    
    # Gerar variações seguras
    return {
        "--color-bg": f"#{bg_color[0]:02x}{bg_color[1]:02x}{bg_color[2]:02x}",
        "--color-text-title": f"#{text_color[0]:02x}{text_color[1]:02x}{text_color[2]:02x}",
        "--color-verse": f"#{accent_color[0]:02x}{accent_color[1]:02x}{accent_color[2]:02x}",
        "--color-link": f"#{min(accent_color[0]+40, 255):02x}"
                         f"{min(accent_color[1]+40, 255):02x}"
                         f"{min(accent_color[2]+40, 255):02x}",
        "--color-shadow": f"#{max(bg_color[0]-50, 0):02x}"
                          f"{max(bg_color[1]-50, 0):02x}"
                          f"{max(bg_color[2]-50, 0):02x}",
        "--color-overlay": f"rgba({bg_color[0]}, {bg_color[1]}, {bg_color[2]}, 0.7)",
        "--color-text-by": f"#{text_color[0]:02x}{text_color[1]:02x}{text_color[2]:02x}55"
    }

def process_albums(folder_path):
    temas = {}
    files = sorted([f for f in os.listdir(folder_path) if f.lower().endswith('.jpg')],
                  key=lambda x: int(''.join(filter(str.isdigit, x))))
    
    for idx, filename in enumerate(files, 1):
        image_path = os.path.join(folder_path, filename)
        colors = get_dominant_colors(image_path)
        
        if not colors:
            continue
            
        color_vars = generate_accessible_colors(colors)
        temas[idx] = color_vars
    
    return temas

if __name__ == "__main__":
    ALBUMS_FOLDER = "/home/paiva/programming/djavanear/public/assets"
    OUTPUT_FILE = "temas_seguros.json"
    
    temas = process_albums(ALBUMS_FOLDER)
    
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(temas, f, indent=2, ensure_ascii=False)
    
    print(f"Gerado {len(temas)} temas com contraste garantido!")