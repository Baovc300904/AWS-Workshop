import subprocess
import sys

# Delete old key
subprocess.run(['aws', 'ec2', 'delete-key-pair', '--key-name', 'game-final2', '--region', 'ap-southeast-1'], capture_output=True)

# Create new key
result = subprocess.run([
    'aws', 'ec2', 'create-key-pair',
    '--key-name', 'gamestore-key',
    '--region', 'ap-southeast-1',
    '--query', 'KeyMaterial',
    '--output', 'text'
], capture_output=True, text=True)

key_material = result.stdout

# Write to file with Unix line endings
with open(r'D:\AWS\keys\gamestore-key.pem', 'w', newline='\n') as f:
    f.write(key_material)

print("✅ Key created: D:\\AWS\\keys\\gamestore-key.pem")
