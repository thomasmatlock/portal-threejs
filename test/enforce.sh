#!/bin/bash
# enforce.sh

set -e

bash test/enforce-cyclomatic.sh
bash test/enforce-loc.sh
