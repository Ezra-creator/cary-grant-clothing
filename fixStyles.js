const fs = require('fs');
const path = require('path');

const targetDirs = [
  'c:\\Users\\DELL\\OneDrive\\Desktop\\HTML FILES\\cary-grant-clothing\\cary-grant-clothing\\app',
  'c:\\Users\\DELL\\OneDrive\\Desktop\\HTML FILES\\cary-grant-clothing\\cary-grant-clothing\\components'
];

const skipFiles = [
  'HeroSection.tsx',
  'SwingTag.tsx',
  'Navbar.tsx',
  'Footer.tsx',
  'Collections.tsx',
  'NewArrivals.tsx',
  'BrandStory.tsx',
  'FeaturedProducts.tsx',
  'Testimonials.tsx',
  'Newsletter.tsx',
  'CartDrawer.tsx',
  'ProductCard.tsx',
  'app\\shop\\page.tsx',
  'app\\product\\[id]\\page.tsx'
];

function processFile(filePath) {
  if (skipFiles.some(skip => filePath.includes(skip))) {
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Remove uppercase and tracking classes
  content = content.replace(/\buppercase\b/g, '');
  content = content.replace(/\btracking-\[.*?\]\b/g, '');
  content = content.replace(/\btracking-widest\b/g, '');
  content = content.replace(/\btracking-wider\b/g, '');
  content = content.replace(/\btracking-wide\b/g, '');
  content = content.replace(/\bfont-cinzel\b/g, 'font-sans');
  
  // 2. Cleanup double spaces in classNames
  content = content.replace(/className=(["'{`])(.*?)\1/g, (match, quote, classes) => {
    return `className=${quote}${classes.replace(/\s+/g, ' ').trim()}${quote}`;
  });

  // 3. Replace bg-cgc-black with bg-cgc-paper
  content = content.replace(/\bbg-cgc-black\b/g, 'bg-cgc-paper');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
      processFile(fullPath);
    }
  }
}

targetDirs.forEach(dir => walkDir(dir));
