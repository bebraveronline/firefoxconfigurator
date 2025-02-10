#!/usr/bin/env python3
import sys
import json
import struct
import os
import subprocess
import platform
from pathlib import Path

def get_message():
    raw_length = sys.stdin.buffer.read(4)
    if not raw_length:
        return None
    message_length = struct.unpack('=I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length)
    return json.loads(message)

def send_message(message):
    content = json.dumps(message).encode('utf-8')
    length = struct.pack('=I', len(content))
    sys.stdout.buffer.write(length)
    sys.stdout.buffer.write(content)
    sys.stdout.buffer.flush()

def get_profile_dir():
    system = platform.system()
    home = str(Path.home())
    
    if system == 'Windows':
        # Windows: %APPDATA%\Mozilla\Firefox\Profiles
        mozilla_dir = os.path.join(os.getenv('APPDATA'), 'Mozilla', 'Firefox')
    elif system == 'Darwin':
        # macOS: ~/Library/Application Support/Firefox/Profiles
        mozilla_dir = os.path.join(home, 'Library', 'Application Support', 'Firefox')
    else:
        # Linux: ~/.mozilla/firefox
        mozilla_dir = os.path.join(home, '.mozilla', 'firefox')
    
    profiles_ini = os.path.join(mozilla_dir, 'profiles.ini')
    if not os.path.exists(profiles_ini):
        return None
        
    default_profile = None
    current_section = {}
    
    with open(profiles_ini, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line.startswith('['):
                if current_section.get('Default') == '1':
                    default_profile = current_section.get('Path')
                    break
                current_section = {}
            elif '=' in line:
                key, value = line.split('=', 1)
                current_section[key.strip()] = value.strip()
    
    if default_profile:
        if os.path.isabs(default_profile):
            return default_profile
        return os.path.join(mozilla_dir, default_profile)
    return None

def restart_firefox():
    system = platform.system()
    try:
        if system == 'Windows':
            # Windows: Use taskkill and start
            subprocess.run(['taskkill', '/F', '/IM', 'firefox.exe'], capture_output=True)
            subprocess.Popen(['start', 'firefox'], shell=True)
        elif system == 'Darwin':
            # macOS: Use pkill and open
            subprocess.run(['pkill', 'firefox'], capture_output=True)
            subprocess.Popen(['open', '-a', 'Firefox'])
        else:
            # Linux: Use pkill and firefox
            subprocess.run(['pkill', 'firefox'], capture_output=True)
            subprocess.Popen(['firefox'])
        return True
    except Exception as e:
        return False

def main():
    while True:
        message = get_message()
        if message is None:
            break
            
        cmd = message.get('cmd')
        response = {'success': False, 'error': 'Unknown command'}
        
        try:
            if cmd == 'WRITE_USER_JS':
                profile_dir = get_profile_dir()
                if not profile_dir:
                    raise Exception('Could not find Firefox profile directory')
                    
                user_js_path = os.path.join(profile_dir, 'user.js')
                with open(user_js_path, 'w', encoding='utf-8') as f:
                    f.write(message['content'])
                response = {'success': True}
                
            elif cmd == 'RESTART_BROWSER':
                if restart_firefox():
                    response = {'success': True}
                else:
                    response = {'success': False, 'error': 'Failed to restart Firefox'}
                
        except Exception as e:
            response = {'success': False, 'error': str(e)}
            
        send_message(response)

if __name__ == '__main__':
    main()