# Firefox Configurator

A Firefox extension to customize privacy, security, and performance settings with ease. This extension provides a user-friendly interface to configure Firefox settings, inspired by the [Arkenfox user.js](https://github.com/arkenfox/user.js) project.

**Note:** This extension is not affiliated with, endorsed by, or supported by the Arkenfox project team.

## Features

- 🛡️ Configure privacy settings to enhance your browsing privacy
- 🔒 Strengthen browser security against potential threats
- ⚡ Optimize Firefox performance
- 💾 Backup and restore configurations
- 🎯 User-friendly interface with detailed explanations
- 📚 Based on well-researched security practices
- ✅ Automatic verification of applied settings
- 🔄 Import/Export functionality for sharing configurations

## Installation

### From Firefox Add-ons
1. Visit the [Firefox Add-ons page](https://addons.mozilla.org/firefox/addon/firefox-configurator/)
2. Click "Add to Firefox"
3. Follow the installation prompts

### Development Build
1. Go to `about:debugging` in Firefox
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select any file from the extension's directory

## Development

### Prerequisites
- Node.js 18 or later
- npm 9 or later

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/bebraveronline/firefoxconfigurator.git
   cd firefoxconfigurator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

### Building the Extension
1. Build the extension:
   ```bash
   npm run build:extension
   ```

The built extension will be in the `extension` directory.

### Testing
Before submitting changes:
1. Test all privacy settings
2. Verify security configurations
3. Check performance optimizations
4. Ensure settings persistence across browser restarts

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── data/          # Settings and categories data
│   ├── types/         # TypeScript type definitions
│   └── background.ts  # Extension background script
├── native/           # Native messaging host
├── scripts/         # Build and utility scripts
└── extension/       # Built extension files
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Please ensure your PR:
- Follows the existing code style
- Includes appropriate tests
- Updates documentation as needed
- Describes the changes made

## Security

This extension:
- Only modifies Firefox preferences through `user.js`
- Requires explicit user action to apply changes
- Verifies all applied settings
- Uses native messaging for system operations
- Has no external dependencies for core functionality

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Arkenfox user.js](https://github.com/arkenfox/user.js) project for research and documentation
- Mozilla Firefox team for browser APIs
- Contributors and users who provide feedback and suggestions

## Disclaimer

This software is provided "as is", without warranty of any kind, express or implied. The authors and maintainers take no responsibility for any potential issues or damages that may arise from using this extension. Use at your own risk.