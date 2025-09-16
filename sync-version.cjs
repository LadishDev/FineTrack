const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, 'package.json');
const versionFilePath = path.join(__dirname, 'src', 'version.ts');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;

const versionTsContent = `export const APP_VERSION = "${version}";\n`;

fs.writeFileSync(versionFilePath, versionTsContent);
console.log(`Updated src/version.ts to version ${version}`);