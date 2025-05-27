#!/bin/bash
# ui-loc.sh
# Checks UI component files for line count violations (over 100 LOC)
# See test/enforce-brevity.md for rationale and details

set -e

UI_DIRS="components/ui components/hud"

find $UI_DIRS -name "*.tsx" 2>/dev/null | xargs wc -l | grep -v total | awk '$1 > 100 { printf "%4d lines (%3d over limit): %s\n", $1, $1-100, $2 }' | sort -nr 