import os
from tkinter import filedialog, Tk
from Aes import AESCipher
import base64
from cryptography.fernet import Fernet
from pathlib import Path

class KeyStorage:
    def __init__(self):
        self.key_file = "key_storage.encrypted"
        self.master_key_file = "master.key"
        self.initialize_storage()

    def initialize_storage(self):
        """Initialize the key storage with a master key"""
        if not os.path.exists(self.master_key_file):
            # Generate and save master key
            master_key = Fernet.generate_key()
            with open(self.master_key_file, 'wb') as f:
                f.write(master_key)
        
        # Create empty key storage if it doesn't exist
        if not os.path.exists(self.key_file):
            self.save_keys({})

    def get_master_key(self):
        """Read the master key"""
        with open(self.master_key_file, 'rb') as f:
            return f.read()

    def save_keys(self, keys_dict):
        """Encrypt and save keys"""
        fernet = Fernet(self.get_master_key())
        encrypted_data = fernet.encrypt(str(keys_dict).encode())
        with open(self.key_file, 'wb') as f:
            f.write(encrypted_data)

    def load_keys(self):
        """Load and decrypt keys"""
        if not os.path.exists(self.key_file):
            return {}
        
        fernet = Fernet(self.get_master_key())
        with open(self.key_file, 'rb') as f:
            encrypted_data = f.read()
        decrypted_data = fernet.decrypt(encrypted_data)
        return eval(decrypted_data.decode())

def save_key(key, file_name):
    """Save encryption key to local storage"""
    storage = KeyStorage()
    keys = storage.load_keys()
    
    base_name = os.path.basename(file_name)
    key_name = base64.b64encode(base_name.encode()).decode()
    key_value = base64.b64encode(key).decode()
    
    keys[key_name] = key_value
    storage.save_keys(keys)
    
    print(f"\nKey stored successfully for: {base_name}")
    return key_name

def get_key(file_name):
    """Retrieve encryption key from local storage"""
    storage = KeyStorage()
    keys = storage.load_keys()
    
    base_name = os.path.basename(file_name)
    if base_name.endswith('.encrypted'):
        base_name = base_name[:-10]
    
    key_name = base64.b64encode(base_name.encode()).decode()
    key_value = keys.get(key_name)
    
    if key_value:
        return base64.b64decode(key_value)
    return None

def select_file():
    """Open a file dialog and return the selected file path"""
    try:
        root = Tk()
        root.attributes('-topmost', True)  # Make the dialog appear on top
        root.withdraw()  # Hide the main window
        root.lift()  # Lift the dialog to the top
        root.focus_force()  # Force focus
        
        file_path = filedialog.askopenfilename(
            title="Select a file to encrypt/decrypt",
            parent=root
        )
        
        root.destroy()  # Properly destroy the Tk instance
        return file_path
    except Exception as e:
        print(f"Error in file selection: {str(e)}")
        return None

def ensure_key_directory():
    """Create key directory if it doesn't exist"""
    key_path = os.getenv('ENCRYPTION_KEY_PATH', 'keys/')
    Path(key_path).mkdir(parents=True, exist_ok=True)
    return key_path

def save_key_to_env(key, file_name):
    """Save encryption key to .env file"""
    base_name = os.path.basename(file_name)
    base_name_with_ext = base_name + '.encrypted'
    
    # Generate key name and value without quotes
    key_name = f"KEY_{base64.b64encode(base_name_with_ext.encode()).decode().rstrip('=')}"
    key_value = base64.b64encode(key).decode().rstrip('=')
    
    # Debug information
    print(f"\nDebug Information for Key Storage:")
    print(f"Original filename: {file_name}")
    print(f"Base name with extension: {base_name_with_ext}")
    print(f"Key name in env: {key_name}")
    
    try:
        # Read existing content
        env_path = find_dotenv()
        if not env_path:
            env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
            Path(env_path).touch()
        
        # Read existing content
        with open(env_path, 'r') as env_file:
            lines = env_file.readlines()
        
        # Remove any existing entry for this key
        lines = [line for line in lines if not line.startswith(key_name)]
        
        # Add the new key
        lines.append(f"{key_name}={key_value}\n")
        
        # Write back all content
        with open(env_path, 'w') as env_file:
            env_file.writelines(lines)
        
        # Reload environment variables
        load_dotenv()
        
        print(f"Key stored successfully in: {env_path}")
        return key_name
    except Exception as e:
        print(f"Error saving to .env: {str(e)}")
        return None

def get_key_from_env(file_name):
    """Retrieve encryption key from .env file"""
    base_name = os.path.basename(file_name)
    # Don't remove .encrypted extension - look for exact match
    key_name = f"KEY_{base64.b64encode(base_name.encode()).decode().rstrip('=')}"
    
    # Debug information
    print(f"\nDebug Information for Key Retrieval:")
    print(f"File name: {file_name}")
    print(f"Looking for key: {key_name}")
    
    # Get key value from environment
    key_value = os.getenv(key_name)
    if key_value:
        try:
            # Add padding back if needed
            padding = 4 - (len(key_value) % 4)
            if padding != 4:
                key_value += '=' * padding
            
            decoded_key = base64.b64decode(key_value)
            print("Key found and decoded successfully")
            return decoded_key
        except Exception as e:
            print(f"Error decoding key value: {str(e)}")
            print(f"Raw key value: {key_value}")
            return None
    
    print(f"No key found matching: {key_name}")
    return None

def load_key(key_file):
    """Load the encryption key from a file"""
    with open(key_file, 'rb') as f:
        return f.read()

def main():
    aes = AESCipher()
    
    while True:
        print("\nFile Encryption/Decryption Tool")
        print("1. Encrypt a file")
        print("2. Decrypt a file")
        print("3. Exit")
        
        choice = input("Enter your choice (1-3): ")
        
        if choice == '1':
            print("Opening file selection dialog...")  # Add feedback
            # Encryption process
            try:
                input_file = select_file()
                if not input_file:
                    print("No file selected or dialog was cancelled.")
                    continue
                
                print(f"Selected file: {input_file}")  # Add feedback
                print("Generating encryption key...")  # Add feedback
                
                # Generate and save the key to environment
                key = aes.generate_key()
                key_name = save_key(key, input_file)
                
                # Encrypt the file
                encrypted_file = aes.encrypt_file(key, input_file)
                print(f"\nFile encrypted successfully!")
                print(f"Encrypted file: {encrypted_file}")
                print(f"Key stored in environment variable: {key_name}")
                
            except Exception as e:
                print(f"Error during encryption: {str(e)}")
        
        elif choice == '2':
            try:
                print("\nSelect the encrypted file to decrypt...")
                input_file = select_file()
                if not input_file:
                    print("No file selected.")
                    continue
                
                print(f"\nDecryption process started for: {input_file}")
                
                # Get key with detailed debugging
                key = get_key(input_file)
                if not key:
                    print("\nKey retrieval failed!")
                    print("Tips:")
                    print("1. Make sure you're selecting the encrypted version of the file")
                    print("2. Verify the file was encrypted using this tool")
                    print("3. Check if the .env file contains the correct key")
                    continue
                
                print("\nKey found successfully, proceeding with decryption...")
                decrypted_file = aes.decrypt_file(key, input_file)
                print(f"File decrypted successfully!")
                print(f"Decrypted file: {decrypted_file}")
                
            except Exception as e:
                print(f"Error during decryption: {str(e)}")
        
        elif choice == '3':
            print("Goodbye!")
            break
        
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()