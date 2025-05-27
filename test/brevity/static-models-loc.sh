#!/bin/bash
# static-models-loc.sh
# Checks static 3D model files for line count violations (over 150 LOC)
# See test/enforce-brevity.md for rationale and details

set -e

MODEL_DIR="models"

find $MODEL_DIR -maxdepth 1 -name "*.tsx" | grep -v Animated | xargs wc -l | grep -v total | awk '$1 > 150 { printf "%4d lines (%3d over 150 limit): %s\n", $1, $1-150, $2 }' | sort -nr 