# Changelog

All notable structural changes and milestones for Portal Three.js will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Documentation

-   **Principles Enforcement**: Enhanced with tiered approach for game development

    -   Implemented contextual LOC limits: Core logic (100), Scene orchestrators (150), Data files (200)
    -   Added prioritized refactoring workflow: Complexity first, then core logic, then scenes
    -   Combined enforcement commands for comprehensive project assessment
    -   Improved pragmatism while maintaining strict quality standards

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
