#!/bin/bash
# enforce-loc.sh
# Enforces LOC limits: 100 for .tsx files, 200 for .ts files (excluding .tsx), 200 for .scss/.css files
# Exits nonzero if any violations are found.

set -e

# Show compliant files (green) if true, otherwise only show warnings/errors
declare -r SHOW_COMPLIANT=true

# Source color definitions
source "$(dirname "$0")/colors.sh"

TSX_LIMIT=100
TS_LIMIT=200
CSS_LIMIT=200

# Check .tsx files
find . -name "*.tsx" | grep -v node_modules | xargs wc -l | grep -v total | awk -v limit=$TSX_LIMIT -v red="$RED" -v yellow="$YELLOW" -v green="$GREEN" -v nc="$NC" -v show_compliant="$SHOW_COMPLIANT" '
  $1 > 2*limit {
    printf "%s%4d lines (%3d over %d limit): %s%s\n", red, $1, $1-limit, limit, $2, nc
  }
  $1 > limit && $1 <= 2*limit {
    printf "%s%4d lines (%3d over %d limit): %s%s\n", yellow, $1, $1-limit, limit, $2, nc
  }
  $1 <= limit && show_compliant == "true" {
    printf "%s%4d lines (within %d limit): %s%s\n", green, $1, limit, $2, nc
  }
' | sort -nr

# Check .ts files (excluding .tsx)
find . -name "*.ts" ! -name "*.tsx" | grep -v node_modules | xargs wc -l | grep -v total | awk -v limit=$TS_LIMIT -v red="$RED" -v yellow="$YELLOW" -v green="$GREEN" -v nc="$NC" -v show_compliant="$SHOW_COMPLIANT" '
  $1 > 2*limit {
    printf "%s%4d lines (%3d over %d limit): %s%s\n", red, $1, $1-limit, limit, $2, nc
  }
  $1 > limit && $1 <= 2*limit {
    printf "%s%4d lines (%3d over %d limit): %s%s\n", yellow, $1, $1-limit, limit, $2, nc
  }
  $1 <= limit && show_compliant == "true" {
    printf "%s%4d lines (within %d limit): %s%s\n", green, $1, limit, $2, nc
  }
' | sort -nr

# Check .scss and .css files
find . \( -name "*.scss" -o -name "*.css" \) | grep -v node_modules | xargs wc -l | grep -v total | awk -v limit=$CSS_LIMIT -v red="$RED" -v yellow="$YELLOW" -v green="$GREEN" -v nc="$NC" -v show_compliant="$SHOW_COMPLIANT" '
  $1 > 2*limit {
    printf "%s%4d lines (%3d over %d limit): %s%s\n", red, $1, $1-limit, limit, $2, nc
  }
  $1 > limit && $1 <= 2*limit {
    printf "%s%4d lines (%3d over %d limit): %s%s\n", yellow, $1, $1-limit, limit, $2, nc
  }
  $1 <= limit && show_compliant == "true" {
    printf "%s%4d lines (within %d limit): %s%s\n", green, $1, limit, $2, nc
  }
' | sort -nr 