#!/bin/bash
# effects-loc.sh
# Checks effect component files for line count violations (over 150 LOC)
# See test/enforce-brevity.md for rationale and details

set -e

EFFECTS_DIR="components/effects"

find $EFFECTS_DIR -name "*.tsx" 2>/dev/null | xargs wc -l | grep -v total | awk '$1 > 150 { printf "%4d lines (%3d over 150 limit): %s\n", $1, $1-150, $2 }' | sort -nr 