import json
import subprocess
import pexpect
import os
import tempfile
import paramiko

def save_response_locally(response_data, file_name):
    try:
        # Get system temp directory
        temp_dir = "/home/ec2-user/drsolitaire/mcidashboard/dashboard/tmp/"
        print(f"Temp directory: {temp_dir}")
        # Create a temporary file
        local_path = os.path.join(temp_dir, file_name)

        with open(local_path, "w") as f:
            json.dump(response_data, f)
        
        print(f"File saved at: {local_path}")
        return local_path
    except Exception as e:
        print(f"Error saving file: {e}")
        return None

def transfer_file_to_server(local_path, remote_path, remote_user, remote_host, password):
    try:
        # Check if the local file exists
        if not os.path.exists(local_path):
            print(f"Error: File not found at {local_path}")
            return False

        # Debug: Log the paths being used
        print(f"Local file path: {local_path}")
        print(f"Remote file path: {remote_path}")

        # Create an SSH client
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        # Connect to the remote server
        ssh.connect(hostname=remote_host, username=remote_user, password=password)

        # Open an SFTP session
        sftp = ssh.open_sftp()

        # Check if the remote directory exists and create it if necessary
        remote_dir = os.path.dirname(remote_path)
        try:
            sftp.listdir(remote_dir)
        except IOError:
            print(f"Remote directory does not exist. Creating: {remote_dir}")
            sftp.mkdir(remote_dir)

        # Transfer the file
        sftp.put(local_path, remote_path)
        print(f"File transferred successfully to {remote_host}:{remote_path}")

        # Close the connections
        sftp.close()
        ssh.close()
        return True
    except Exception as e:
        print(f"Error transferring file: {e}")
        return False
    
def append_to_the_file_on_server(data, remote_path, remote_user, remote_host, password):
    print(data)
    try:
        # Create an SSH client
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        # Connect to the remote server
        ssh.connect(hostname=remote_host, username=remote_user, password=password)

        # Open an SFTP session
        sftp = ssh.open_sftp()

        # Open the remote file if exists, create it otherwise
        if sftp.file(remote_path):
            remote_file = sftp.file(remote_path, "a")
        else:
            remote_file = sftp.file(remote_path, "w")

        # Append the data to the file
        remote_file.write(data)

        # Close the file and the connections
        remote_file.close()
        sftp.close()
        ssh.close()
        return True
    except Exception as e:
        print(f"Error appending to the file: {e}")


# remote_user = 'graceage'
# remote_host = 'lamp-shell.icts.kuleuven.be'
# remote_path = '/www/homes/graceage/dr_solitaire/3_response.json'
# local_path = "C:/dr_solitaire/mcidashboard/dashboard/tmp/3_response.json"
# transfer_file_to_server(local_path, remote_path, remote_user, remote_host, 'eesie6so2Eas')
