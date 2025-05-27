# Simplicity Enforcement

This file documents the enforcement of code simplicity (cyclomatic complexity limits) for this codebase. It provides rationale, commands, and architectural context for keeping functions understandable and maintainable.

---

## Simplicity Checker

This tool measures the complexity of individual functions by counting decision paths. Functions with high cyclomatic complexity are harder to understand, maintain, and test properly. I use a threshold of 7 as the maximum acceptable complexity.

```

```
