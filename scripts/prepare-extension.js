import { readFile, writeFile, copyFile, mkdir } from 'fs/promises';
import { resolve } from 'path';

async function prepareExtension() {
  try {
    // Create extension directory
    await mkdir('extension', { recursive: true });
    
    // Copy dist files to extension directory
    await copyFile('dist/index.html', 'extension/index.html');
    await copyFile('dist/main.js', 'extension/main.js');
    await copyFile('dist/background.js', 'extension/background.js');
    
    // Copy manifest
    await copyFile('manifest.json', 'extension/manifest.json');
    
    // Create zip file for submission
    // Note: You'll need to zip the extension directory manually for now
    
    console.log('Extension prepared successfully!');
  } catch (error) {
    console.error('Error preparing extension:', error);
    process.exit(1);
  }
}

prepareExtension();