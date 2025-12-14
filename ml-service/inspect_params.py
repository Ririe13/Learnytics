import h5py
import numpy as np

try:
    with h5py.File("learning_style_model.h5", 'r') as f:
        print("--- Scaler Means ---")
        print(f['scaler']['mean_'][:])
        print("\n--- Scaler Scales ---")
        print(f['scaler']['scale_'][:])
        print("\n--- Centroids ---")
        print(f['kmeans']['cluster_centers_'][:])
except Exception as e:
    print(e)
