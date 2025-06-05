from cryptography.fernet import Fernet

def load_key():
    with open("secret.key", "rb") as key_file:
        return key_file.read()

fernet = Fernet(load_key())

def encrypt_file(data: bytes) -> bytes:
    return fernet.encrypt(data)

def decrypt_file(data: bytes) -> bytes:
    return fernet.decrypt(data)
