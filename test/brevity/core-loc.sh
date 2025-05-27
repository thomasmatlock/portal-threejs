#!/bin/bash
# core-loc.sh
# Checks core logic and utility files for line count violations (over 100 LOC)
# See test/enforce-brevity.md for rationale and details

set -e

CORE_DIRS="components/core utils pages/api"

find $CORE_DIRS -name "*.tsx" -o -name "*.ts" | grep -v data | xargs wc -l | grep -v total | awk '$1 > 100 { printf "%4d lines (%3d over limit): %s\n", $1, $1-100, $2 }' | sort -nr 