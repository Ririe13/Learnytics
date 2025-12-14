
# Script untuk Mengubah Model .h5 ke Format Web (JSON)
# ====================================================
# Cara pakai (di Google Colab atau Laptop yang ada Python):
# 1. Install library: pip install tensorflowjs
# 2. Jalankan command: tensorflowjs_converter --input_format=keras learning_style_model.h5 ./tfjs_model
#
# Atau jalankan script ini:

import os
import sys

try:
    import tensorflowjs as tfjs
except ImportError:
    print("Library tensorflowjs belum terinstall. Mohon install dengan: pip install tensorflowjs")
    sys.exit(1)

input_path = 'learning_style_model.h5' 
output_path = './tfjs_model'

if not os.path.exists(input_path):
    print(f"Error: File {input_path} tidak ditemukan!")
    sys.exit(1)

print(f"Mengkonversi {input_path} ke format TensorFlow.js...")
# Gunakan command line tool dari tensorflowjs
os.system(f'tensorflowjs_converter --input_format=keras {input_path} {output_path}')

print(f"Selesai! Cek folder '{output_path}'. Anda akan melihat 'model.json' dan file .bin")
