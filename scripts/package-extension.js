import { createWriteStream } from 'fs';
import archiver from 'archiver';

async function packageExtension() {
  try {
    const output = createWriteStream('firefox-configurator.zip');
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    archive.pipe(output);

    // Add all files from extension directory
    archive.directory('extension/', false);

    await new Promise((resolve, reject) => {
      output.on('close', resolve);
      archive.on('error', reject);
      archive.finalize();
    });

    console.log('Extension packaged successfully!');
    console.log('Created: firefox-configurator.zip');
    console.log('\nNext steps:');
    console.log('1. Go to https://addons.mozilla.org/developers/addon/submit/');
    console.log('2. Sign in or create a developer account');
    console.log('3. Click "Submit a New Add-on"');
    console.log('4. Upload firefox-configurator.zip');
    console.log('5. Fill in the required information:');
    console.log('   - Name: Firefox Configurator');
    console.log('   - Summary: Configure Firefox privacy, security, and performance settings with ease');
    console.log('   - Add-on Type: Extension');
    console.log('   - Platform: Firefox');
    console.log('6. Submit for review');
  } catch (error) {
    console.error('Error packaging extension:', error);
    process.exit(1);
  }
}

packageExtension();