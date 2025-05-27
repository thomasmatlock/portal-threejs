#!/bin/bash
# data-files-loc.sh
# Checks data/config files for line count violations (over 200 LOC)
# See test/enforce-brevity.md for rationale and details

set -e

find . -name "*Data.ts" -o -name "*Config.ts" -o -name "*Constants.ts" -o -name "*data*.ts" | grep -v node_modules | xargs wc -l | grep -v total | awk '$1 > 200 { printf "%4d lines (%3d over 200 limit): %s\n", $1, $1-200, $2 }' | sort -nr 