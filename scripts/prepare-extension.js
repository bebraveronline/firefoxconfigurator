import { readFile, writeFile, copyFile, mkdir } from 'fs/promises';
import { existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import sharp from 'sharp';

async function generateIcons() {
  // Create icons directory
  await mkdir('extension/assets', { recursive: true });

  // Generate 48x48 icon
  await sharp('src/assets/icon-48.svg')
    .resize(48, 48)
    .png()
    .toFile('extension/assets/icon-48.png');

  // Generate 96x96 icon
  await sharp('src/assets/icon-96.svg')
    .resize(96, 96)
    .png()
    .toFile('extension/assets/icon-96.png');
}

async function prepareExtension() {
  try {
    // Create extension directory
    await mkdir('extension', { recursive: true });
    await mkdir('extension/assets', { recursive: true });
    
    // Generate icons
    await generateIcons();
    
    // Copy manifest.json
    await copyFile('manifest.json', 'extension/manifest.json');
    
    // Copy and process HTML files
    const htmlContent = await readFile('dist/index.html', 'utf-8');
    await writeFile('extension/popup.html', htmlContent);
    
    // Copy success and error pages
    await copyFile('src/success.html', 'extension/success.html');
    await copyFile('src/error.html', 'extension/error.html');
    
    // Copy background script
    await copyFile('dist/background.js', 'extension/background.js');
    
    // Copy assets
    if (existsSync('dist/assets')) {
      const assets = readdirSync('dist/assets');
      for (const asset of assets) {
        await copyFile(
          resolve('dist/assets', asset),
          resolve('extension/assets', asset)
        );
      }
    }
    
    console.log('Extension prepared successfully!');
  } catch (error) {
    console.error('Error preparing extension:', error);
    process.exit(1);
  }
}

prepareExtension();