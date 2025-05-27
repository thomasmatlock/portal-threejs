# Principles Enforcer

This document contains a couple of tools I use to systematically enforce code quality principles rather than relying on memory or manual inspection. These automated enforcers help ensure consistent quality across the codebase.

## Table of Contents

-   [Brevity Enforcement](./enforce-brevity.md)
-   [Simplicity Enforcement](./enforce-simplicity.md)

## Why These Matter

These tools directly enforce several of my core development principles:

1. **Directory-based file size limits** - The directory-based LOC checker ensures files remain focused while acknowledging that different parts of the codebase serve fundamentally different purposes. UI components need strict limits, while game maps can contain procedural data.
2. **Functional over abstract** - By limiting cyclomatic complexity, we prevent overly clever code that's hard to understand.
3. **"6-Month Maintainability Index"** - Both tools help ensure code will be understandable six months from now, with realistic expectations based on file responsibility rather than file type.
4. **Flat schema over nested** - High cyclomatic complexity often indicates excessive nesting.
5. **Architecture-aware quality** - The directory-based approach recognizes the actual structure of game development: controllers should be lightweight, UI components focused, models can be complex, and maps contain procedural data.

Together, these automated enforcers create guardrails that protect code quality without requiring constant vigilance. They transform quality principles from guidelines into measurable, enforceable standards that adapt to the actual architecture and file responsibilities of your codebase.

## How To Use

After implementing a feature or making changes:

1. Run the [brevity checker](./enforce-brevity.md) to identify files violating their architectural size limits:
    - **Critical violations**: UI components, controllers, core logic >100 LOC
    - **High violations**: Static models, effects >150 LOC
    - **Medium violations**: Animation systems, orchestrators >200 LOC
    - **Low violations**: Game maps >400 LOC, data files >200 LOC
2. Run the [simplicity checker](./enforce-simplicity.md) to find functions that have become too complex (>7 cyclomatic complexity)
3. Prioritize refactoring by architectural impact:
    - **First**: Fix complexity violations (break down complex functions)
    - **Second**: Address UI component and controller violations (user-facing impact)
    - **Third**: Optimize core logic and static models
    - **Fourth**: Review animation systems and orchestrators
    - **Last**: Examine game maps only if they're becoming unmaintainable
4. Refactor identified files/functions before considering the work complete

This systematic, architecture-aware approach ensures quality while respecting the different roles files play in a game codebase.
