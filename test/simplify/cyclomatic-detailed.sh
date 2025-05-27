#!/bin/bash
# cyclomatic-detailed.sh
# Runs a detailed ESLint cyclomatic complexity check
# Groups violations by file, shows line, complexity, and percent over limit
# See test/enforce-simplicity.md for rationale and details

set -e

npx eslint components pages utils --ext .ts,.tsx --rule 'complexity: ["error", 7]' --format json | \
  node -e '
const data = JSON.parse(require("fs").readFileSync(0, "utf8"));
data.forEach(file => {
  if (file.messages.length === 0) return;
  console.log(`\n${file.filePath}:`);
  file.messages.forEach(msg => {
    if (msg.ruleId === "complexity") {
      const complexity = parseInt(msg.message.match(/\d+/)[0]);
      const overLimit = ((complexity - 7) / 7 * 100).toFixed(0);
      console.log(`  Line ${msg.line}: Complexity: ${complexity} (${overLimit}% over limit)`);
    }
  });
});
'
