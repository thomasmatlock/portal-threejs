# Brevity Enforcement

This file documents the enforcement of code brevity (file length limits) for this codebase. It provides rationale, commands, and architectural context for keeping files focused and maintainable.

---

## 1. Brevity Checker - Directory-Based Approach

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
