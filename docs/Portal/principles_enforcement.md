# Principles Enforcer

This document contains a couple of tools I use to systematically enforce code quality principles rather than relying on memory or manual inspection. These automated enforcers help ensure consistent quality across the codebase.

## 1. Lines of Code (LOC) Checker

This command identifies files exceeding 100 lines of code, which is my threshold for file complexity. Files exceeding this limit are candidates for refactoring into smaller, more focused components.

```bash
# Find all TypeScript/React files with more than 100 lines
find components pages utils -name "*.tsx" -o -name "*.ts" | xargs wc -l | awk '$1 > 100 { print $0 }' | sort -nr

# Alternative version with percentage indicator showing how far over limit
find components pages utils -name "*.tsx" -o -name "*.ts" | xargs wc -l | awk '$1 > 100 { printf "%4d lines (%3d%% over limit): %s\n", $1, $1-100, $2 }' | sort -nr

# Include styles and config files in the check
find . -name "*.tsx" -o -name "*.ts" -o -name "*.scss" -o -name "*.css" | grep -v node_modules | grep -v .next | xargs wc -l | awk '$1 > 100 { printf "%4d lines (%3d over limit): %s\n", $1, $1-100, $2 }' | sort -nr
```

## 2. Cyclomatic Complexity Checker

This tool measures the complexity of individual functions by counting decision paths. Functions with high cyclomatic complexity are harder to understand, maintain, and test properly. I use a threshold of 7 as the maximum acceptable complexity.

```bash
# Check cyclomatic complexity of all TypeScript/React files
# Flag any function with complexity > 7
npx eslint components pages utils --ext .ts,.tsx --rule 'complexity: ["error", 7]' --format unix

# For more detailed analysis with exact scores using a custom formatter:
npx eslint components pages utils --ext .ts,.tsx --rule 'complexity: ["error", 7]' --format json | \
  node -e 'const data = JSON.parse(require("fs").readFileSync(0, "utf8"));
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
    });'

# Alternative using complexity-report for more detailed metrics:
npx complexity-report --format json components/**/*.{ts,tsx} pages/**/*.{ts,tsx} utils/**/*.{ts,tsx} | \
  node -e 'const data = JSON.parse(require("fs").readFileSync(0, "utf8"));
    data.reports.forEach(report => {
      report.functions.forEach(fn => {
        if (fn.complexity.cyclomatic > 7) {
          const overLimit = ((fn.complexity.cyclomatic - 7) / 7 * 100).toFixed(0);
          console.log(`${report.path}:${fn.line} - ${fn.name}: ${fn.complexity.cyclomatic} (${overLimit}% over limit)`);
        }
      });
    });'
```

## Why These Matter

These tools directly enforce several of my core development principles:

1. **Small files (<100 LOC)** - The LOC checker ensures files remain focused and maintainable.

2. **Functional over abstract** - By limiting cyclomatic complexity, we prevent overly clever code that's hard to understand.

3. **"6-Month Maintainability Index"** - Both tools help ensure code will be understandable six months from now.

4. **Flat schema over nested** - High cyclomatic complexity often indicates excessive nesting.

Together, these automated enforcers create guardrails that protect code quality without requiring constant vigilance. They transform quality principles from guidelines into measurable, enforceable standards.

## How To Use

After implementing a feature or making changes:

1. Run the LOC checker to identify any files that have grown too large
2. Run the complexity checker to find functions that have become too complex
3. Refactor identified files/functions before considering the work complete

This systematic approach helps ensure sustainable quality and easy long term maintenance.​​​​​​​​​​​​​​​​
