#!/bin/bash
# maps-loc.sh
# Checks game map/level files for line count violations (over 400 LOC)
# See test/enforce-brevity.md for rationale and details

set -e

MAP_DIRS="models/maps components/maps"

find $MAP_DIRS -name "*.tsx" 2>/dev/null | xargs wc -l | grep -v total | awk '$1 > 400 { printf "%4d lines (%3d over 400 limit): %s\n", $1, $1-400, $2 }' | sort -nr 