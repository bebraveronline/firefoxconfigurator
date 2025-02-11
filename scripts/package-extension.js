import { createWriteStream, createReadStream } from 'fs';
import { createGzip } from 'zlib';
import { create } from 'tar';
import { pipeline } from 'stream/promises';
import { join } from 'path';

async function packageExtension() {
  try {
    const outputFile = 'userjs-generator.zip';
    
    // Create a gzip compressed tar archive
    await create({
      gzip: true,
      file: outputFile,
      cwd: 'extension',
      prefix: 'extension'
    }, ['./']);

    console.log('Extension packaged successfully!');
    console.log(`Created: ${outputFile}`);
    console.log('\nNext steps:');
    console.log('1. Go to https://addons.mozilla.org/developers/addon/submit/');
    console.log('2. Sign in or create a developer account');
    console.log('3. Click "Submit a New Add-on"');
    console.log('4. Upload userjs-generator.zip');
    console.log('5. Fill in the required information:');
    console.log('   - Name: user.js Generator');
    console.log('   - Summary: Generate and manage browser privacy, security, and performance settings');
    console.log('   - Add-on Type: Extension');
    console.log('   - Platform: Firefox');
    console.log('6. Submit for review');
  } catch (error) {
    console.error('Error packaging extension:', error);
    process.exit(1);
  }
}

packageExtension();