#!/usr/bin/env python3
import os
import sys
import json
import platform
import shutil
from pathlib import Path

def get_native_messaging_location():
    system = platform.system()
    if system == 'Windows':
        # Windows: %PROGRAMFILES%\Mozilla\NativeMessagingHosts
        return os.path.join(os.getenv('PROGRAMFILES'), 'Mozilla', 'NativeMessagingHosts')
    elif system == 'Darwin':
        # macOS: /Library/Application Support/Mozilla/NativeMessagingHosts
        return '/Library/Application Support/Mozilla/NativeMessagingHosts'
    else:
        # Linux: ~/.mozilla/native-messaging-hosts
        return os.path.join(str(Path.home()), '.mozilla', 'native-messaging-hosts')

def install_native_messaging_host():
    try:
        # Get the absolute path of the script directory
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Create the native messaging hosts directory if it doesn't exist
        native_messaging_dir = get_native_messaging_location()
        os.makedirs(native_messaging_dir, exist_ok=True)
        
        # Get the absolute path of the Python script
        python_script_path = os.path.join(script_dir, 'firefox_configurator.py')
        
        # Make the Python script executable
        if platform.system() != 'Windows':
            os.chmod(python_script_path, 0o755)
        
        # Create the manifest with the correct path
        manifest = {
            "name": "firefox_configurator",
            "description": "Native messaging host for Firefox Configurator",
            "path": python_script_path,
            "type": "stdio",
            "allowed_extensions": ["firefox_configurator@example.com"]
        }
        
        # Write the manifest file
        manifest_path = os.path.join(native_messaging_dir, 'firefox_configurator.json')
        with open(manifest_path, 'w', encoding='utf-8') as f:
            json.dump(manifest, f, indent=2)
        
        print(f"Native messaging host installed successfully in {native_messaging_dir}")
        return True
        
    except Exception as e:
        print(f"Error installing native messaging host: {str(e)}")
        return False

if __name__ == '__main__':
    # Check if running with admin/root privileges on Windows/Unix
    if platform.system() == 'Windows':
        import ctypes
        if not ctypes.windll.shell32.IsUserAnAdmin():
            print("Please run this script as Administrator")
            sys.exit(1)
    elif os.geteuid() == 0:
        print("Please run this script without sudo")
        sys.exit(1)
        
    if install_native_messaging_host():
        print("Installation completed successfully")
    else:
        print("Installation failed")
        sys.exit(1)