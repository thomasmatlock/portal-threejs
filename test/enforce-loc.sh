#!/bin/bash
# enforce-loc.sh
# Runs all LOC checks previously in individual scripts, reporting any violations.
# Exits nonzero if any violations are found.

set -e

# Source color definitions
source "$(dirname "$0")/colors.sh"

#############################
# Animation Systems LOC Check
#############################
ANIMATION_LIMIT=100
ANIMATION_DIRS="models/animations models"
find $ANIMATION_DIRS -name "*Animated*.tsx" -o -name "*Controller*.ts" -o -name "*Library*.ts" 2>/dev/null | xargs wc -l | grep -v total | awk -v limit=$ANIMATION_LIMIT -v red="$RED" -v yellow="$YELLOW" -v nc="$NC" '
  $1 > 2*limit {
    printf "%s%4d lines (%3d over %d limit): %s%s\n", red, $1, $1-limit, limit, $2, nc
  }
  $1 > limit && $1 <= 2*limit {
    printf "%s%4d lines (%3d over %d limit): %s%s\n", yellow, $1, $1-limit, limit, $2, nc
  }
' | sort -nr

#########################
# Controllers LOC Check
#########################
CONTROLLER_LIMIT=100
CONTROLLER_DIRS="models/controllers components/controllers"
find $CONTROLLER_DIRS -name "*.tsx" -o -name "*.ts" 2>/dev/null | xargs wc -l | grep -v total | awk -v limit=$CONTROLLER_LIMIT -v red="$RED" -v yellow="$YELLOW" -v nc="$NC" '
  $1 > 2*limit {
    printf "%s%4d lines (%3d over limit): %s%s\n", red, $1, $1-limit, $2, nc
  }
  $1 > limit && $1 <= 2*limit {
    printf "%s%4d lines (%3d over limit): %s%s\n", yellow, $1, $1-limit, $2, nc
  }
' | sort -nr

#########################
# Core LOC Check
#########################
CORE_LIMIT=100
CORE_DIRS="components/core utils pages/api"
find $CORE_DIRS -name "*.tsx" -o -name "*.ts" | grep -v data | xargs wc -l | grep -v total | awk -v limit=$CORE_LIMIT -v red="$RED" -v yellow="$YELLOW" -v nc="$NC" '
  $1 > 2*limit {
    printf "%s%4d lines (%3d over limit): %s%s\n", red, $1, $1-limit, $2, nc
  }
  $1 > limit && $1 <= 2*limit {
    printf "%s%4d lines (%3d over limit): %s%s\n", yellow, $1, $1-limit, $2, nc
  }
' | sort -nr

#########################
# Data Files LOC Check
#########################
DATA_LIMIT=200
find . -name "*Data.ts" -o -name "*Config.ts" -o -name "*Constants.ts" -o -name "*data*.ts" | grep -v node_modules | xargs wc -l | grep -v total | awk -v limit=$DATA_LIMIT -v red="$RED" -v yellow="$YELLOW" -v nc="$NC" '
  $1 > 2*limit {
    printf "%s%4d lines (%3d over %d limit): %s%s\n", red, $1, $1-limit, limit, $2, nc
  }
  $1 > limit && $1 <= 2*limit {
    printf "%s%4d lines (%3d over %d limit): %s%s\n", yellow, $1, $1-limit, limit, $2, nc
  }
' | sort -nr

#########################
# Effects LOC Check
#########################
EFFECTS_LIMIT=150
EFFECTS_DIR="components/effects"
find $EFFECTS_DIR -name "*.tsx" 2>/dev/null | xargs wc -l | grep -v total | awk -v limit=$EFFECTS_LIMIT -v red="$RED" -v yellow="$YELLOW" -v nc="$NC" '
  $1 > 2*limit {
    printf "%s%4d lines (%3d over %d limit): %s%s\n", red, $1, $1-limit, limit, $2, nc
  }
  $1 > limit && $1 <= 2*limit {
    printf "%s%4d lines (%3d over %d limit): %s%s\n", yellow, $1, $1-limit, limit, $2, nc
  }
' | sort -nr

#########################
# Maps LOC Check
#########################
MAPS_LIMIT=400
MAP_DIRS="models/maps components/maps"
find $MAP_DIRS -name "*.tsx" 2>/dev/null | xargs wc -l | grep -v total | awk -v limit=$MAPS_LIMIT -v red="$RED" -v yellow="$YELLOW" -v nc="$NC" '
  $1 > 2*limit {
    printf "%s%4d lines (%3d over %d limit): %s%s\n", red, $1, $1-limit, limit, $2, nc
  }
  $1 > limit && $1 <= 2*limit {
    printf "%s%4d lines (%3d over %d limit): %s%s\n", yellow, $1, $1-limit, limit, $2, nc
  }
' | sort -nr

#########################
# Orchestrators LOC Check
#########################
ORCH_LIMIT=200
find . -name "index.tsx" -o -name "*Scene*.tsx" | grep -v node_modules | xargs wc -l | grep -v total | awk -v limit=$ORCH_LIMIT -v red="$RED" -v yellow="$YELLOW" -v nc="$NC" '
  $1 > 2*limit {
    printf "%s%4d lines (%3d over %d limit): %s%s\n", red, $1, $1-limit, limit, $2, nc
  }
  $1 > limit && $1 <= 2*limit {
    printf "%s%4d lines (%3d over %d limit): %s%s\n", yellow, $1, $1-limit, limit, $2, nc
  }
' | sort -nr

#########################
# Static Models LOC Check
#########################
STATIC_LIMIT=150
MODEL_DIR="models"
find $MODEL_DIR -maxdepth 1 -name "*.tsx" | grep -v Animated | xargs wc -l | grep -v total | awk -v limit=$STATIC_LIMIT -v red="$RED" -v yellow="$YELLOW" -v nc="$NC" '
  $1 > 2*limit {
    printf "%s%4d lines (%3d over %d limit): %s%s\n", red, $1, $1-limit, limit, $2, nc
  }
  $1 > limit && $1 <= 2*limit {
    printf "%s%4d lines (%3d over %d limit): %s%s\n", yellow, $1, $1-limit, limit, $2, nc
  }
' | sort -nr

#########################
# UI LOC Check
#########################
UI_LIMIT=100
UI_DIRS="components"
find $UI_DIRS -name "*.tsx" 2>/dev/null | xargs wc -l | grep -v total | awk -v limit=$UI_LIMIT -v red="$RED" -v yellow="$YELLOW" -v nc="$NC" '
  $1 > 2*limit {
    printf "%s%4d lines (%3d over limit): %s%s\n", red, $1, $1-limit, $2, nc
  }
  $1 > limit && $1 <= 2*limit {
    printf "%s%4d lines (%3d over limit): %s%s\n", yellow, $1, $1-limit, $2, nc
  }
' | sort -nr 