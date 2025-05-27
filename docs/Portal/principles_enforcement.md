# Principles Enforcer

This document contains a couple of tools I use to systematically enforce code quality principles rather than relying on memory or manual inspection. These automated enforcers help ensure consistent quality across the codebase.

## 1. Lines of Code (LOC) Checker

This command identifies files exceeding 100 lines of code, which is my threshold for file complexity. Files exceeding this limit are candidates for refactoring into smaller, more focused components.

```bash
# Find all Ruby files with more than 100 lines
find app -name "*.rb" -exec wc -l {} \; | awk '$1 > 100 { print $0 }' | sort -nr

# Alternative version with percentage indicator showing how far over limit
find app -name "*.rb" -exec wc -l {} \; | awk '$1 > 100 { printf "%4d lines (%3d%% of limit): %s\n", $1, $1*100/100, $2 }' | sort -nr
```

## 2. Cyclomatic Complexity Checker

This tool measures the complexity of individual methods by counting decision paths. Methods with high cyclomatic complexity are harder to understand, maintain, and test properly. I use a threshold of 7 as the maximum acceptable complexity.

```bash
# Check cyclomatic complexity of all Ruby files
# Flag any method with complexity > 7
bundle exec rubocop --only Metrics/CyclomaticComplexity

# For more detailed analysis with exact scores:
bundle exec rubocop --format json --only Metrics/CyclomaticComplexity | \
  ruby -r json -e 'data = JSON.load(STDIN); data["files"].each do |file|
    next if file["offenses"].empty?;
    puts "\n#{file["path"]}:";
    file["offenses"].each do |offense|
      complexity = offense["message"].scan(/\d+/).first.to_i;
      puts "  Line #{offense["location"]["line"]}: Complexity: #{complexity} (#{(complexity-7.0)/7.0*100}% over limit)";
    end;
  end'
```

## Why These Matter

These tools directly enforce several of my core development principles:

1. **Small files (<100 LOC)** - The LOC checker ensures files remain focused and maintainable.

2. **Functional over abstract** - By limiting cyclomatic complexity, we prevent overly clever code that's hard to understand.

3. **"6-Month Maintainability Index"** - Both tools help ensure code will be understandable six months from now.

4. **Flat schema over nested** - High cyclomatic complexity often indicates excessive nesting.

Together, these automated enforcers create guardrails that protect code quality without requiring constant vigilance. They transform quality principles from guidelines into measurable, enforceable standards.

## How To Use

After implementing a feature or making changes:

1. Run the LOC checker to identify any files that have grown too large
2. Run the complexity checker to find methods that have become too complex
3. Refactor identified files/methods before considering the work complete

This systematic approach helps ensure sustainable quality and easy long term maintenance.​​​​​​​​​​​​​​​​
