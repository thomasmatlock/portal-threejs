# Principles Enforcer

This document contains a couple of tools I use to systematically enforce code quality principles rather than relying on memory or manual inspection. These automated enforcers help ensure consistent quality across the codebase.

## 1. Lines of Code (LOC) Checker - Tiered Approach

This uses a contextual approach to file size limits, recognizing that different file types have different complexity characteristics. Game development requires some flexibility while maintaining the core principle of focused, maintainable files.

### Core Logic Files (100 LOC - Strict)

Business logic, UI components, and utilities should stay small and focused:

```bash
# Check core logic files against strict 100 LOC limit
find components pages utils -name "*.tsx" -o -name "*.ts" | grep -v data | xargs wc -l | awk '$1 > 100 { printf "%4d lines (%3d over limit): %s\n", $1, $1-100, $2 }' | sort -nr
```

### Data/Config Files (200 LOC - Relaxed)

Pure data structures and configuration files can be larger without complexity burden:

```bash
# Check data/config files against relaxed 200 LOC limit
find . -name "*Data.ts" -o -name "*Config.ts" -o -name "*Constants.ts" -o -name "*data*.ts" | grep -v node_modules | xargs wc -l | awk '$1 > 200 { printf "%4d lines (%3d over 200 limit): %s\n", $1, $1-200, $2 }' | sort -nr
```

### Scene Orchestrators (150 LOC - Moderate)

Game scenes and main orchestrator files can be moderately larger due to their coordinating nature:

```bash
# Check scene/orchestrator files against moderate 150 LOC limit
find . -name "*Scene.tsx" -o -name "index.tsx" | grep -v node_modules | xargs wc -l | awk '$1 > 150 { printf "%4d lines (%3d over 150 limit): %s\n", $1, $1-150, $2 }' | sort -nr
```

### Combined Tiered Check

Run all three tiers in sequence for complete assessment:

```bash
echo "=== CORE LOGIC FILES (100 LOC STRICT) ==="
find components pages utils -name "*.tsx" -o -name "*.ts" | grep -v data | xargs wc -l | awk '$1 > 100 { printf "%4d lines (%3d over limit): %s\n", $1, $1-100, $2 }' | sort -nr

echo -e "\n=== DATA/CONFIG FILES (200 LOC RELAXED) ==="
find . -name "*Data.ts" -o -name "*Config.ts" -o -name "*Constants.ts" -o -name "*data*.ts" | grep -v node_modules | xargs wc -l | awk '$1 > 200 { printf "%4d lines (%3d over 200 limit): %s\n", $1, $1-200, $2 }' | sort -nr

echo -e "\n=== SCENE ORCHESTRATORS (150 LOC MODERATE) ==="
find . -name "*Scene.tsx" -o -name "index.tsx" | grep -v node_modules | xargs wc -l | awk '$1 > 150 { printf "%4d lines (%3d over 150 limit): %s\n", $1, $1-150, $2 }' | sort -nr
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

1. **Contextual file size limits** - The tiered LOC checker ensures files remain focused while acknowledging that different file types have different complexity characteristics. Pure data files can be larger without becoming unmaintainable.

2. **Functional over abstract** - By limiting cyclomatic complexity, we prevent overly clever code that's hard to understand.

3. **"6-Month Maintainability Index"** - Both tools help ensure code will be understandable six months from now, with realistic expectations for different file types.

4. **Flat schema over nested** - High cyclomatic complexity often indicates excessive nesting.

5. **Game development pragmatism** - The tiered approach recognizes that game orchestration files and scene management require some additional complexity while maintaining strict standards for business logic.

Together, these automated enforcers create guardrails that protect code quality without requiring constant vigilance. They transform quality principles from guidelines into measurable, enforceable standards that adapt to the realities of different file types.

## How To Use

After implementing a feature or making changes:

1. Run the tiered LOC checker to identify files violating their contextual size limits:

    - Critical violations: Core logic files >100 LOC
    - High violations: Scene orchestrators >150 LOC
    - Low violations: Data files >200 LOC

2. Run the complexity checker to find functions that have become too complex (>7 cyclomatic complexity)

3. Prioritize refactoring:

    - **First**: Fix complexity violations (break down complex functions)
    - **Second**: Address core logic LOC violations
    - **Third**: Optimize scene orchestrators if needed
    - **Last**: Review data files only if extremely large

4. Refactor identified files/functions before considering the work complete

This systematic, prioritized approach helps ensure sustainable quality while being pragmatic about game development realities.
