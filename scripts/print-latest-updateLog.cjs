#!/usr/bin/env node
// Print the latest updateLog entry for the current version (from version.ts)
const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, '../src/version.ts');
const updateLogFile = path.join(__dirname, '../src/updateLog.json');

const versionMatch = fs.readFileSync(versionFile, 'utf8').match(/VERSION\s*=\s*"([0-9.]+)"/);
if (!versionMatch) {
  console.error('Could not find version in src/version.ts');
  process.exit(1);
}
const version = versionMatch[1];
const updateLog = JSON.parse(fs.readFileSync(updateLogFile, 'utf8'));
const summary = updateLog[version] || '';
console.log(summary);
