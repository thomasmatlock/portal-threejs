#!/bin/bash
# enforce.sh
# Runs all LOC and cyclomatic complexity enforcement scripts
# See test/enforce-brevity.md and test/enforce-simplicity.md for rationale and details

set -e

# Run all brevity (LOC) checks
for script in test/brevity/*.sh; do
  bash "$script"
done


bash test/simplify/cyclomatic.sh
