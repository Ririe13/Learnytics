
def check_header(filepath):
    try:
        with open(filepath, 'rb') as f:
            header = f.read(8)
            print(f"Header: {header}")
            print(f"Hex: {header.hex()}")
            
            # HDF5 signature
            if header.hex().startswith("894844460d0a1a0a"):
                print("Type: HDF5 (likely Keras)")
            else:
                print("Type: Unknown (possibly Pickle/Joblib if sklearn)")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_header("learning_style_model.h5")
