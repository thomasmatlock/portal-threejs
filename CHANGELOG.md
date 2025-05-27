# Changelog

All notable structural changes and milestones for Portal Three.js will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Refactoring

-   **AudioPlayer Component**: Decomposed monolithic 509-line component into focused modules

    -   Split into 4 UI components: Controls (42 lines), Progress (53 lines), Volume (25 lines), Main (78 lines)
    -   Extracted audio logic into reusable `useAudioPlayer` hook (225 lines)
    -   Organized components in `/audio` subdirectory for better file structure
    -   Eliminated 2 cyclomatic complexity violations through focused function design
    -   Achieved full compliance with directory-based LOC enforcement

### Documentation

-   **Principles Enforcement**: Redesigned with directory-based approach for game architecture

    -   Replaced generic file-type limits with architecture-aware directory limits
    -   UI components (100 LOC), Models (150 LOC), Animation systems (200 LOC), Game maps (400 LOC)
    -   Enforcement now matches actual project structure: controllers, models, maps, effects
    -   Prioritized refactoring by architectural impact rather than arbitrary file patterns
    -   Architecture-aware quality that respects different file responsibilities

-   **Principles Enforcement**: Updated tooling for TypeScript/React projects

    -   Converted Ruby-specific commands to work with TypeScript/React files
    -   Added ESLint-based cyclomatic complexity checking with detailed reporting
    -   Added style and config file checking capabilities
    -   Improved percentage calculations for overlimit reporting

-   **Portal README**: Streamlined feature list
    -   Removed planned features not yet implemented
    -   Focus on core mechanics and confirmed capabilities

### Project Structure

-   **Documentation Organization**: Restructured docs into logical folders

    -   Portal content: dialog, characters, audio, legal
    -   Marketing materials: awards strategy, YouTuber outreach
    -   Technical docs: file structure, features, mechanics

-   **Component Architecture**: Established clear separation of concerns

    -   `components/effects/` - Visual effects and post-processing
    -   `components/maps/` - Level and scene components
    -   `components/common/` - Reusable UI components
    -   `components/hud/` - Game interface elements

-   **Asset Organization**: Simplified file structure
    -   Renamed `images/` to `img/` for convention
    -   Removed redundant "Portal" prefixes from filenames
    -   Flattened nested folder hierarchies

### Technical Foundation

-   **Effects System**: Set up comprehensive post-processing pipeline

    -   Bloom, chromatic aberration, film grain ready for Portal aesthetics
    -   Organized in dedicated effects folder for maintainability

-   **Character System**: Planned complete Portal cast
    -   Models and controllers for GLaDOS, Wheatley, Atlas, P-Body
    -   Audio integration for contextual character dialog

### Development Practices

-   **Commit Style**:
    -   Clear, direct statements focused on what changed
    -   Descriptive context for complex changes
    -   No unnecessary prefixes or ceremony

---

_For detailed change history, see git commit log with `git log --oneline`_
