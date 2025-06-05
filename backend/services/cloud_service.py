import os
from utils.crypt import encrypt_file, decrypt_file
from utils.roles import require_roles

UPLOAD_DIR = "/home/emilian/snap/snapd-desktop-integration/253/cloud_app/backend/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_encrypted_file(filename: str, content: bytes):
    if not filename or not content:
        raise ValueError("Filename and content must be provided")
    try:
        encrypted_content = encrypt_file(content)
    except Exception as e:
        raise ValueError(f"Encryption failed: {e}")

    file_path = os.path.join(UPLOAD_DIR, filename + ".enc")
    try:
        with open(file_path, "wb") as f:
            f.write(encrypted_content)
    except Exception as e:
        raise ValueError(f"Failed to save file: {e}")

def list_encrypted_files():
    try:
        files = [f.replace(".enc", "") for f in os.listdir(UPLOAD_DIR) if f.endswith(".enc")]
        return files
    except Exception as e:
        raise ValueError(f"Failed to list files: {e}")

def get_decrypted_file(filename: str) -> bytes:
    if not filename:
        raise ValueError("Filename must be provided")

    file_path = os.path.join(UPLOAD_DIR, filename + ".enc")
    if not os.path.exists(file_path):
        return None
    try:
        with open(file_path, "rb") as f:
            encrypted_content = f.read()
        decrypted = decrypt_file(encrypted_content)
        return decrypted
    except Exception as e:
        raise ValueError(f"Decryption failed: {e}")
