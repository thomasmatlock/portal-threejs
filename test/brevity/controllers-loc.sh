#!/bin/bash
# controllers-loc.sh
# Checks controller files for line count violations (over 100 LOC)
# See test/enforce-brevity.md for rationale and details

set -e

CONTROLLER_DIRS="models/controllers components/controllers"

find $CONTROLLER_DIRS -name "*.tsx" -o -name "*.ts" 2>/dev/null | xargs wc -l | grep -v total | awk '$1 > 100 { printf "%4d lines (%3d over limit): %s\n", $1, $1-100, $2 }' | sort -nr 