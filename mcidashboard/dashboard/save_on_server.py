import json
import subprocess
import pexpect
import os
import tempfile
import paramiko

def save_response_locally(response_data, file_name):
    try:
        
        temp_dir = "/home/ec2-user/drsolitaire/mcidashboard/dashboard/tmp/"
        print(f"Temp directory: {temp_dir}")
        
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
        if not os.path.exists(local_path):
            print(f"Error: File not found at {local_path}")
            return False

        print(f"Local file path: {local_path}")
        print(f"Remote file path: {remote_path}")

        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        ssh.connect(hostname=remote_host, username=remote_user, password=password)

        sftp = ssh.open_sftp()

        remote_dir = os.path.dirname(remote_path)
        try:
            sftp.listdir(remote_dir)
        except IOError:
            print(f"Remote directory does not exist. Creating: {remote_dir}")
            sftp.mkdir(remote_dir)

        sftp.put(local_path, remote_path)
        print(f"File transferred successfully to {remote_host}:{remote_path}")

        sftp.close()
        ssh.close()
        return True
    except Exception as e:
        print(f"Error transferring file: {e}")
        return False
    
def append_to_the_file_on_server(data, remote_path, remote_user, remote_host, password):
    print(data)
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        ssh.connect(hostname=remote_host, username=remote_user, password=password)

        sftp = ssh.open_sftp()

        if sftp.file(remote_path):
            remote_file = sftp.file(remote_path, "a")
        else:
            remote_file = sftp.file(remote_path, "w")

        remote_file.write(data)

        remote_file.close()
        sftp.close()
        ssh.close()
        return True
    except Exception as e:
        print(f"Error appending to the file: {e}")
