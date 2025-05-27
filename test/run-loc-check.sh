#!/bin/bash
# run-loc-check.sh
# Delegates to test/brevity/ui-loc.sh for UI LOC enforcement

bash test/brevity/ui-loc.sh

# Checks UI component files for line count violations (over 100 LOC)
# See test/enforce-brevity.md for rationale and details

set -e

UI_DIRS="components/ui components/hud"

# Print header
echo "=== UI COMPONENTS LOC CHECK (100 LOC STRICT) ==="

# Find and check all .tsx files in UI directories
find $UI_DIRS -name "*.tsx" 2>/dev/null | xargs wc -l | awk '$1 > 100 { printf "%4d lines (%3d over limit): %s\n", $1, $1-100, $2 }' | sort -nr

echo "\nCheck complete. See test/enforce-brevity.md for next steps." 