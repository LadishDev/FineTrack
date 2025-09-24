// Usage: node scripts/update-updateLog.cjs <new-version>
// This script parses CHANGELOG.md and updates src/updateLog.json with the latest version and summary.

const fs = require('fs');
const path = require('path');

const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
const updateLogPath = path.join(__dirname, '..', 'src', 'updateLog.json');

const newVersion = process.argv[2];
if (!newVersion) {
  console.error('Usage: node scripts/update-updateLog.cjs <new-version>');
  process.exit(1);
}

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
