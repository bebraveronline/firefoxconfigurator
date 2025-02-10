# Firefox Configurator Native Messaging Host

This directory contains the native messaging host for the Firefox Configurator extension. The host enables the extension to write settings to your Firefox profile and restart the browser.

## Installation Instructions

### Prerequisites
- Python 3.6 or later
- Firefox browser installed
- Administrator privileges (Windows only)

### Windows
1. Open Command Prompt as Administrator
2. Navigate to this directory
3. Run: `python install_host.py`

### macOS and Linux
1. Open Terminal
2. Navigate to this directory
3. Run: `python3 install_host.py`

## Troubleshooting

### Windows
- Make sure you're running the installer as Administrator
- Check that Python is in your PATH
- Verify that Firefox is installed in the default location

### macOS
- Ensure Python 3 is installed (`brew install python3` if using Homebrew)
- Check permissions of the installation directory
- Verify that Firefox is installed in the Applications folder

### Linux
- Ensure Python 3 is installed
- Check that Firefox is installed via package manager
- Verify write permissions to ~/.mozilla directory

## Manual Installation

If the automatic installer fails, you can manually install the host:

1. Copy `firefox_configurator.py` to a permanent location
2. Make it executable (Linux/macOS): `chmod +x firefox_configurator.py`
3. Create the native messaging hosts directory:
   - Windows: `%PROGRAMFILES%\Mozilla\NativeMessagingHosts`
   - macOS: `/Library/Application Support/Mozilla/NativeMessagingHosts`
   - Linux: `~/.mozilla/native-messaging-hosts`
4. Create `firefox_configurator.json` in the native messaging hosts directory with the correct path to the Python script

## Uninstallation

1. Delete the `firefox_configurator.json` file from your native messaging hosts directory
2. Delete the `firefox_configurator.py` script

## Security Note

The native messaging host runs with user privileges and can:
- Read and write to your Firefox profile directory
- Restart Firefox

Review the code before installation to understand its functionality.