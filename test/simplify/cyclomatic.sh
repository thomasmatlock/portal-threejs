#!/bin/bash
# cyclomatic.sh
# Runs a detailed ESLint cyclomatic complexity check
# Groups violations by file, shows line, complexity, and percent over limit
# See test/enforce-simplicity.md for rationale and details

set -e

THRESHOLD=7

npx eslint components pages utils --ext .ts,.tsx --rule "complexity: ['error', $THRESHOLD]" --format json | \
  node -e '
const path = require("path");
const THRESHOLD = '"$THRESHOLD"';
const data = JSON.parse(require("fs").readFileSync(0, "utf8"));
data.forEach(file => {
  if (file.messages.length === 0) return;
  console.log(`\n${path.basename(file.filePath)}:`);
  file.messages.forEach(msg => {
    if (msg.ruleId === "complexity") {
      const complexity = parseInt(msg.message.match(/\d+/)[0]);
      const overLimit = ((complexity - THRESHOLD) / THRESHOLD * 100).toFixed(0);
      console.log(`  Line ${msg.line}: Complexity: ${complexity} (${overLimit}% over limit)`);
    }
  });
});
'
