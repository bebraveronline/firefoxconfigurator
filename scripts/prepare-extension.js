import { readFile, writeFile, copyFile, mkdir } from 'fs/promises';
import { existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';

async function prepareExtension() {
  try {
    // Create extension directory
    await mkdir('extension', { recursive: true });
    await mkdir('extension/assets', { recursive: true });
    
    // Copy and rename index.html to popup.html
    const indexHtml = await readFile('dist/index.html', 'utf-8');
    const popupHtml = indexHtml
      .replace(/src="\/assets\//g, 'src="./assets/')
      .replace(/href="\/assets\//g, 'href="./assets/');
    await writeFile('extension/popup.html', popupHtml);
    
    // Copy assets if they exist
    if (existsSync('dist/assets')) {
      const assets = readdirSync('dist/assets');
      for (const asset of assets) {
        const srcPath = resolve('dist/assets', asset);
        const destPath = resolve('extension/assets', asset);
        await mkdir(dirname(destPath), { recursive: true });
        await copyFile(srcPath, destPath);
      }
    }
    
    // Copy background script if it exists
    if (existsSync('dist/background.js')) {
      await copyFile('dist/background.js', 'extension/background.js');
    }
    
    // Copy manifest
    await copyFile('manifest.json', 'extension/manifest.json');
    
    console.log('Extension prepared successfully!');
  } catch (error) {
    console.error('Error preparing extension:', error);
    process.exit(1);
  }
}

prepareExtension();