const fs = require('fs');
const path = require('path');

// Copy HTML files from .next/server/pages to .next for Netlify
const sourceDir = path.join(__dirname, '../.next/server/pages');
const destDir = path.join(__dirname, '../.next');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`Source directory ${src} does not exist`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy HTML files to root of .next
if (fs.existsSync(sourceDir)) {
  console.log('Copying HTML files for Netlify...');
  const htmlFiles = fs.readdirSync(sourceDir).filter(file => file.endsWith('.html'));
  
  htmlFiles.forEach(file => {
    const src = path.join(sourceDir, file);
    const dest = path.join(destDir, file);
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file}`);
  });
}

// Ensure static directory exists and is properly structured
const staticDir = path.join(__dirname, '../.next/static');
const nextStaticDir = path.join(__dirname, '../.next/_next/static');

if (fs.existsSync(staticDir)) {
  console.log('Static files directory exists');
  // Create _next/static structure for Netlify
  if (!fs.existsSync(nextStaticDir)) {
    fs.mkdirSync(nextStaticDir, { recursive: true });
  }
  // Copy entire static directory to _next/static for proper path resolution
  // This includes: css, chunks, media (images), and build manifests
  copyRecursive(staticDir, nextStaticDir);
  console.log('Copied static files (CSS, JS, images) to _next/static');
  
  // Also ensure media files are accessible
  const mediaDir = path.join(staticDir, 'media');
  if (fs.existsSync(mediaDir)) {
    console.log(`Found ${fs.readdirSync(mediaDir).length} media files`);
  }
} else {
  console.log('Warning: Static directory not found');
}

// Copy _redirects file to .next
const redirectsSrc = path.join(__dirname, '../public/_redirects');
const redirectsDest = path.join(destDir, '_redirects');
if (fs.existsSync(redirectsSrc)) {
  fs.copyFileSync(redirectsSrc, redirectsDest);
  console.log('Copied _redirects file');
}

console.log('Build files copied successfully for Netlify!');
