// Usage: node scripts/UpdateChangelog.cjs
// This script parses CHANGELOG.md and updates src/updateLog.json with the latest version and summary.

const fs = require('fs');
const path = require('path');

const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
const updateLogPath = path.join(__dirname, '..', 'src', 'updateLog.json');
const versionFile = path.join(__dirname, '..', 'src', 'version.ts');

// Read version from src/version.ts
const versionMatch = fs.readFileSync(versionFile, 'utf8').match(/VERSION\s*=\s*"([0-9.]+)"/);
if (!versionMatch) {
  console.error('Could not find version in src/version.ts');
  process.exit(1);
}
const newVersion = versionMatch[1];

const changelog = fs.readFileSync(changelogPath, 'utf8');

// Match headings like '## [0.1.1](...) (date)', '# 1.0.0 (date)', etc.
const headingPattern = `#{1,2}\\s*\\[?${newVersion.replace(/\\./g, '\\.')}(?:\\])?(?:\\([^\\)]*\\))?(?:\\s*\\([^\\)]*\\))?`;
const match = new RegExp(`${headingPattern}(?:\\r?\\n)+([\\s\\S]*?)(?=^#{1,2} |\\n#|\\n$)`, 'm').exec(changelog);
if (!match) {
  console.error(`Could not find changelog entry for version ${newVersion}`);
  process.exit(1);
}
let summary = match[1].trim();
if (!summary) summary = 'No summary provided.';

const updateLog = JSON.parse(fs.readFileSync(updateLogPath, 'utf8'));
updateLog[newVersion] = summary;
fs.writeFileSync(updateLogPath, JSON.stringify(updateLog, null, 2));
console.log(`updateLog.json updated for version ${newVersion}`);
