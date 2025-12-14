import h5py
import numpy as np
import os

class CustomModel:
    def __init__(self, model_path):
        self.model_path = model_path
        self.means = None
        self.scales = None
        self.centroids = None
        self.mappings = {
            0: "fast_learner",
            1: "consistent_learner",
            2: "reflective_learner"
        }
        self.load_model()

    def load_model(self):
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model file not found at {self.model_path}")

        try:
            with h5py.File(self.model_path, 'r') as f:
                # Load Scaler parameters
                if 'scaler' in f:
                    self.means = f['scaler']['mean_'][:]
                    self.scales = f['scaler']['scale_'][:]
                else:
                    raise KeyError("Group 'scaler' not found in H5 file")

                # Load KMeans parameters
                if 'kmeans' in f:
                    self.centroids = f['kmeans']['cluster_centers_'][:]
                else:
                    raise KeyError("Group 'kmeans' not found in H5 file")
                
                print("Model loaded successfully.")
                print(f"Centroids shape: {self.centroids.shape}")
                print(f"Scaler means shape: {self.means.shape}")

        except Exception as e:
            raise Exception(f"Failed to load model: {str(e)}")

    def predict(self, features):
        """
        Predict learning style from features.
        Args:
            features (list or np.array): List of 9 feature values
        Returns:
            str: Learning style label
        """
        if self.means is None or self.centroids is None:
            raise Exception("Model not loaded")

        # Convert to numpy array
        x = np.array(features, dtype=float)
        
        # 1. Scale features
        # (x - mean) / scale
        x_scaled = (x - self.means) / self.scales

        # 2. Compute distances to centroids
        # Distance = sqrt(sum((x - center)^2))
        distances = np.linalg.norm(self.centroids - x_scaled, axis=1)

        # 3. Find closest centroid
        cluster_id = np.argmin(distances)
        
        # 4. Map to label
        return self.mappings.get(int(cluster_id), "consistent_learner")
