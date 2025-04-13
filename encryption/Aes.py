from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad
import os

class AESCipher:
    def __init__(self):
        self.block_size = AES.block_size

    def generate_key(self):
        """Generate a random 32-byte (256-bit) key"""
        return get_random_bytes(32)

    def encrypt_file(self, key, input_file, output_file=None):
        """Encrypt a file using AES-256 in CBC mode"""
        if output_file is None:
            output_file = input_file + '.encrypted'

        # Generate random IV (Initialization Vector)
        iv = get_random_bytes(self.block_size)
        
        # Create cipher object
        cipher = AES.new(key, AES.MODE_CBC, iv)

        # Read and encrypt file
        file_size = os.path.getsize(input_file)
        
        with open(input_file, 'rb') as f_in:
            with open(output_file, 'wb') as f_out:
                # Write the IV at the beginning of the file
                f_out.write(iv)
                
                while True:
                    chunk = f_in.read(1024 * self.block_size)
                    if len(chunk) == 0:
                        break
                    elif len(chunk) % self.block_size != 0:
                        chunk = pad(chunk, self.block_size)
                    
                    encrypted_chunk = cipher.encrypt(chunk)
                    f_out.write(encrypted_chunk)
        
        return output_file

    def decrypt_file(self, key, input_file, output_file=None):
        """Decrypt a file using AES-256 in CBC mode"""
        if output_file is None:
            output_file = input_file.rsplit('.encrypted', 1)[0]

        with open(input_file, 'rb') as f_in:
            # Read the IV from the beginning of the file
            iv = f_in.read(self.block_size)
            
            # Create cipher object for decryption
            cipher = AES.new(key, AES.MODE_CBC, iv)
            
            with open(output_file, 'wb') as f_out:
                while True:
                    chunk = f_in.read(1024 * self.block_size)
                    if len(chunk) == 0:
                        break
                    
                    decrypted_chunk = cipher.decrypt(chunk)
                    
                    # Remove padding from the last chunk
                    if not chunk:
                        break
                    if len(chunk) < 1024 * self.block_size:
                        decrypted_chunk = unpad(decrypted_chunk, self.block_size)
                    
                    f_out.write(decrypted_chunk)
        
        return output_file

# Example usage
def main():
    aes = AESCipher()
    
    # Generate a new key
    key = aes.generate_key()
    
    # Example: Encrypt a file
    try:
        encrypted_file = aes.encrypt_file(key, "example.txt")
        print(f"File encrypted successfully: {encrypted_file}")
        
        # Decrypt the file
        decrypted_file = aes.decrypt_file(key, encrypted_file)
        print(f"File decrypted successfully: {decrypted_file}")
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()