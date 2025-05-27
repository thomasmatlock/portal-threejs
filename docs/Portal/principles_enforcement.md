# Principles Enforcer

This document contains a couple of tools I use to systematically enforce code quality principles rather than relying on memory or manual inspection. These automated enforcers help ensure consistent quality across the codebase.

## 1. Lines of Code (LOC) Checker - Directory-Based Approach

This uses a contextual approach based on directory purpose and file responsibility, recognizing that different parts of a game codebase have fundamentally different complexity characteristics and constraints.

### UI Components (100 LOC - Strict)

User interface components should be small, focused, and easily testable:

```bash
# Check UI components against strict 100 LOC limit
find components/ui components/hud -name "*.tsx" | xargs wc -l | awk '$1 > 100 { printf "%4d lines (%3d over limit): %s\n", $1, $1-100, $2 }' | sort -nr
```

### Core Logic & Utils (100 LOC - Strict)

Business logic, utilities, and core systems should stay focused:

```bash
# Check core logic files against strict 100 LOC limit
find components/core utils pages/api -name "*.tsx" -o -name "*.ts" | grep -v data | xargs wc -l | awk '$1 > 100 { printf "%4d lines (%3d over limit): %s\n", $1, $1-100, $2 }' | sort -nr
```

### Simple Controllers (100 LOC - Strict)

Model controllers and simple orchestrators should be lightweight:

```bash
# Check controller files against strict 100 LOC limit
find models/controllers components/controllers -name "*.tsx" -o -name "*.ts" 2>/dev/null | xargs wc -l | awk '$1 > 100 { printf "%4d lines (%3d over limit): %s\n", $1, $1-100, $2 }' | sort -nr
```

### Static Models & Effects (150 LOC - Moderate)

Static 3D models and effect components can be moderately complex:

```bash
# Check static models and effects against moderate 150 LOC limit
find models -maxdepth 1 -name "*.tsx" | grep -v Animated | xargs wc -l | awk '$1 > 150 { printf "%4d lines (%3d over 150 limit): %s\n", $1, $1-150, $2 }' | sort -nr
find components/effects -name "*.tsx" 2>/dev/null | xargs wc -l | awk '$1 > 150 { printf "%4d lines (%3d over 150 limit): %s\n", $1, $1-150, $2 }' | sort -nr
```

### Animation Systems (200 LOC - Moderate)

Animated models and animation controllers handle complex state:

```bash
# Check animation systems against moderate 200 LOC limit
find models/animations models -name "*Animated*.tsx" -o -name "*Controller*.ts" -o -name "*Library*.ts" 2>/dev/null | xargs wc -l | awk '$1 > 200 { printf "%4d lines (%3d over 200 limit): %s\n", $1, $1-200, $2 }' | sort -nr
```

### Game Orchestrators (200 LOC - Moderate)

Main game coordination and scene management files:

```bash
# Check game orchestrators against moderate 200 LOC limit
find . -name "index.tsx" -o -name "*Scene*.tsx" | grep -v node_modules | xargs wc -l | awk '$1 > 200 { printf "%4d lines (%3d over 200 limit): %s\n", $1, $1-200, $2 }' | sort -nr
```

### Game Maps/Levels (400 LOC - Relaxed)

Test chambers and level definitions contain procedural positioning data:

```bash
# Check game maps against relaxed 400 LOC limit
find models/maps components/maps -name "*.tsx" 2>/dev/null | xargs wc -l | awk '$1 > 400 { printf "%4d lines (%3d over 400 limit): %s\n", $1, $1-400, $2 }' | sort -nr
```

### Data Files (200 LOC - Relaxed)

Pure data structures and configuration files:

```bash
# Check data files against relaxed 200 LOC limit
find . -name "*Data.ts" -o -name "*Config.ts" -o -name "*Constants.ts" -o -name "*data*.ts" | grep -v node_modules | xargs wc -l | awk '$1 > 200 { printf "%4d lines (%3d over 200 limit): %s\n", $1, $1-200, $2 }' | sort -nr
```

### Combined Directory-Based Check

Run all tiers in sequence for complete assessment:

```bash
echo "=== UI COMPONENTS (100 LOC STRICT) ==="
find components/ui components/hud -name "*.tsx" 2>/dev/null | xargs wc -l | awk '$1 > 100 { printf "%4d lines (%3d over limit): %s\n", $1, $1-100, $2 }' | sort -nr

echo -e "\n=== CORE LOGIC & UTILS (100 LOC STRICT) ==="
find components/core utils pages/api -name "*.tsx" -o -name "*.ts" | grep -v data | xargs wc -l | awk '$1 > 100 { printf "%4d lines (%3d over limit): %s\n", $1, $1-100, $2 }' | sort -nr

echo -e "\n=== CONTROLLERS (100 LOC STRICT) ==="
find models/controllers components/controllers -name "*.tsx" -o -name "*.ts" 2>/dev/null | xargs wc -l | awk '$1 > 100 { printf "%4d lines (%3d over limit): %s\n", $1, $1-100, $2 }' | sort -nr

echo -e "\n=== STATIC MODELS & EFFECTS (150 LOC MODERATE) ==="
find models -maxdepth 1 -name "*.tsx" | grep -v Animated | xargs wc -l | awk '$1 > 150 { printf "%4d lines (%3d over 150 limit): %s\n", $1, $1-150, $2 }' | sort -nr
find components/effects -name "*.tsx" 2>/dev/null | xargs wc -l | awk '$1 > 150 { printf "%4d lines (%3d over 150 limit): %s\n", $1, $1-150, $2 }' | sort -nr

echo -e "\n=== ANIMATION SYSTEMS (200 LOC MODERATE) ==="
find models/animations models -name "*Animated*.tsx" -o -name "*Controller*.ts" -o -name "*Library*.ts" 2>/dev/null | xargs wc -l | awk '$1 > 200 { printf "%4d lines (%3d over 200 limit): %s\n", $1, $1-200, $2 }' | sort -nr

echo -e "\n=== GAME ORCHESTRATORS (200 LOC MODERATE) ==="
find . -name "index.tsx" -o -name "*Scene*.tsx" | grep -v node_modules | xargs wc -l | awk '$1 > 200 { printf "%4d lines (%3d over 200 limit): %s\n", $1, $1-200, $2 }' | sort -nr

echo -e "\n=== GAME MAPS/LEVELS (400 LOC RELAXED) ==="
find models/maps components/maps -name "*.tsx" 2>/dev/null | xargs wc -l | awk '$1 > 400 { printf "%4d lines (%3d over 400 limit): %s\n", $1, $1-400, $2 }' | sort -nr

echo -e "\n=== DATA FILES (200 LOC RELAXED) ==="
find . -name "*Data.ts" -o -name "*Config.ts" -o -name "*Constants.ts" -o -name "*data*.ts" | grep -v node_modules | xargs wc -l | awk '$1 > 200 { printf "%4d lines (%3d over 200 limit): %s\n", $1, $1-200, $2 }' | sort -nr
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

1. **Directory-based file size limits** - The directory-based LOC checker ensures files remain focused while acknowledging that different parts of the codebase serve fundamentally different purposes. UI components need strict limits, while game maps can contain procedural data.

2. **Functional over abstract** - By limiting cyclomatic complexity, we prevent overly clever code that's hard to understand.

3. **"6-Month Maintainability Index"** - Both tools help ensure code will be understandable six months from now, with realistic expectations based on file responsibility rather than file type.

4. **Flat schema over nested** - High cyclomatic complexity often indicates excessive nesting.

5. **Architecture-aware quality** - The directory-based approach recognizes the actual structure of game development: controllers should be lightweight, UI components focused, models can be complex, and maps contain procedural data.

Together, these automated enforcers create guardrails that protect code quality without requiring constant vigilance. They transform quality principles from guidelines into measurable, enforceable standards that adapt to the actual architecture and file responsibilities of your codebase.

## How To Use

After implementing a feature or making changes:

1. Run the directory-based LOC checker to identify files violating their architectural size limits:

    - **Critical violations**: UI components, controllers, core logic >100 LOC
    - **High violations**: Static models, effects >150 LOC
    - **Medium violations**: Animation systems, orchestrators >200 LOC
    - **Low violations**: Game maps >400 LOC, data files >200 LOC

2. Run the complexity checker to find functions that have become too complex (>7 cyclomatic complexity)

3. Prioritize refactoring by architectural impact:

    - **First**: Fix complexity violations (break down complex functions)
    - **Second**: Address UI component and controller violations (user-facing impact)
    - **Third**: Optimize core logic and static models
    - **Fourth**: Review animation systems and orchestrators
    - **Last**: Examine game maps only if they're becoming unmaintainable

4. Refactor identified files/functions before considering the work complete

This systematic, architecture-aware approach ensures quality while respecting the different roles files play in a game codebase.
