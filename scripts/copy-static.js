const fs = require('fs');
const path = require('path');

function cp(src, dest) {
  try {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} -> ${dest}`);
  } catch (e) {
    console.error(`Failed to copy ${src} -> ${dest}:`, e.message);
    process.exitCode = 1;
  }
}

const root = process.cwd();
const pub = path.join(root, 'public');
const dist = path.join(root, 'dist');

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist, { recursive: true });
}

cp(path.join(pub, 'sitemap.xml'), path.join(dist, 'sitemap.xml'));
cp(path.join(pub, 'robots.txt'), path.join(dist, 'robots.txt'));

