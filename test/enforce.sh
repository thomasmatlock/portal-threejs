#!/bin/bash
# enforce-brevity.sh
# Runs all LOC enforcement scripts in test/brevity
# See test/enforce-brevity.md for rationale and details

set -e

for script in test/brevity/*.sh; do
  bash "$script"
done

echo "All brevity checks complete. See test/enforce-brevity.md for next steps." 