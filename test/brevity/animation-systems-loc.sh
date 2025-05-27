#!/bin/bash
# animation-systems-loc.sh
# Checks animation system files for line count violations (over 200 LOC)
# See test/enforce-brevity.md for rationale and details

set -e

ANIMATION_DIRS="models/animations models"

find $ANIMATION_DIRS -name "*Animated*.tsx" -o -name "*Controller*.ts" -o -name "*Library*.ts" 2>/dev/null | xargs wc -l | grep -v total | awk '$1 > 200 { printf "%4d lines (%3d over 200 limit): %s\n", $1, $1-200, $2 }' | sort -nr 