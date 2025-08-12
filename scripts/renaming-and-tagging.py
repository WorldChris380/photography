import os
from PIL import Image
from lavis.models import load_model_and_preprocess
from clip_interrogator import Config, Interrogator
import torch

# Ordner mit Bildern
input_dir = "../src/assets/img/photography"
output_file = "../src/assets/img/photography/renamed"

# BLIP2 Modell laden (nutzt automatisch die GPU, wenn verfügbar)
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Verwende Gerät: {device}")

model, vis_processors, _ = load_model_and_preprocess(
    name="blip2_t5_instruct", model_type="pretrain_flant5xl", is_eval=True, device=device
)
ci = Interrogator(Config(clip_model_name="ViT-L-14/openai"))

results = []

for root, _, files in os.walk(input_dir):
    for file in files:
        if file.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            img_path = os.path.join(root, file)
            try:
                raw_image = Image.open(img_path).convert("RGB")
                # BLIP2 Caption
                image_blip = vis_processors["eval"](raw_image).unsqueeze(0).to(device)
                caption = model.generate({"image": image_blip})[0]
                # CLIP Tags
                tags = ci.interrogate(raw_image)
                print(f"{img_path}: {caption} | Tags: {tags}")
                results.append(f'"{img_path}","{caption}","{tags}"')
            except Exception as e:
                print(f"Fehler bei {img_path}: {e}")

# Ergebnisse als CSV speichern
with open(output_file, "w", encoding="utf-8") as f:
    f.write("image_path,caption,tags\n")
    for line in results:
        f.write(line + "\n")

print(f"Fertig! Ergebnisse in {output_file}")