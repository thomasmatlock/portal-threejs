# Changelog

All notable structural changes and milestones for Portal Three.js will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Documentation

-   **README**: Cleaned up documentation section by removing outdated principles enforcement reference
    -   Removed broken link to principles enforcement guidelines
    -   Streamlined documentation references to focus on active game design docs

### Refactoring

-   **Crosshair Component**: Extracted reticle system into dedicated HUD component

    -   Moved crosshair implementation from inline JSX in Main component to `components/ui/hud/Crosshair`
    -   Created reusable component with TypeScript interface for extensibility
    -   Extracted all reticle styles into dedicated module for better separation of concerns
    -   Organized HUD elements in proper directory structure for future scalability
    -   Improved code maintainability while preserving existing functionality

### Documentation

-   **Portal Awards Strategy**: Enhanced proven track record with working background context

    -   Added truck driver background context to emphasize achievement against odds
    -   Specified 10-15 hours per week development time constraint
    -   Strengthens narrative of exceptional dedication and time management skills
    -   Reinforces credibility of award-winning results achieved under challenging circumstances

-   **Portal Awards Strategy**: Enhanced proven track record section with self-taught developer achievement

    -   Added emphasis on self-taught developer status to strengthen award narrative
    -   Highlighted exceptional dedication and skill development outside traditional education paths
    -   Reinforces credibility of achieving award-winning results through independent learning

-   **Portal Awards Strategy**: Added proven track record section to strengthen submission confidence

    -   Added "Proven Award Success" section documenting previous CSS Design Awards wins
    -   Highlighted 7.93/10 final judge score and 8.30/10 innovation score from portfolio project
    -   Established credibility with 4 total awards won in December 2023
    -   Positioned Portal Three.js as 10x leap in complexity from award-winning foundation
    -   Enhanced submission confidence based on demonstrated track record

-   **README**: Added Portal 2 soundtrack documentation to tech stack

    -   Added complete Portal 2 OST reference in Audio & AI section
    -   Highlighted implemented tracks like "Science is Fun", "Wheatley Science", and "Reconstructing More Science"
    -   Documents all three soundtrack volumes available in the project

-   **README**: Streamlined structure by removing implementation details

    -   Removed Project Structure section to eliminate maintenance overhead
    -   Removed Development section (ESLint, Sass, Cloudflare) to focus on core game technologies
    -   Tech stack now flows cleanly from framework to user-facing features

-   **README**: Added emojis to features section for improved visual appeal

    -   Added contextually appropriate emojis to each feature (🌀 portals, 🔐 auth, 💾 saves, 👥 multiplayer, 🤖 AI, 🔊 audio, 🎨 UI, 🥚 easter eggs)
    -   Enhanced readability and scannability while maintaining professional tone

-   **README**: Elevated changelog prominence with dedicated section

    -   Added "Development History" section immediately after Features for better visibility
    -   Enhanced changelog description to highlight development milestones and architectural decisions
    -   Removed redundant changelog reference from Documentation section at bottom

-   **README**: Added Google Auth and Supabase to tech stack

    -   Added "Authentication & Data" section with Google OAuth for player login
    -   Added Supabase for progress saving, user data, and real-time features
    -   Updated features to highlight player authentication and automatic progress saving
    -   Enhanced co-op multiplayer description to include friend invitations
    -   Updated live demo description to showcase new platform capabilities

-   **README**: Removed GSAP from tech stack

    -   Cleaned up Animation & Interaction section to reflect current dependencies
    -   Removed outdated reference to unused GSAP library

-   **README**: Added Colyseus to tech stack for multiplayer functionality

    -   Added dedicated "Multiplayer & Networking" section to tech stack
    -   Documents planned real-time multiplayer server framework for co-op gameplay

-   **README**: Removed Contributing section to streamline project documentation
    -   Contributing guidelines were redundant for a demonstration project
    -   Focus on project overview and technical information for portfolio showcase

### Cleanup

-   **GameMenu.module.scss**: Removed unused stylesheet file
    -   File was no longer referenced in codebase after menu system refactoring

### Fixes

-   **TestChamber03 Model**: Corrected import path for shared pointer event handlers
    -   Fixed relative import path from `./shared/` to `../shared/` for proper module resolution

### Refactoring

-   **WheatleyRig Animation System**: Decomposed 273-line monolithic component into focused modules

    -   Split into 7 files: Main component (19 lines), Custom hook (76 lines), 4 utility modules (38-100 lines each), Re-export index (6 lines)
    -   Extracted complex animation logic into pure utility functions: head shaking, distractions, mouse following
    -   Created reusable `useWheatleyBehavior` hook following React patterns
    -   Separated TypeScript interfaces into dedicated `wheatleyTypes.ts` for reusability
    -   Eliminated cyclomatic complexity violation (complexity 15) through function decomposition
    -   Achieved compliance with 100 LOC strict limit for all utility files
    -   Main component now focused solely on rendering with clean separation of concerns

-   **FirstPersonController Component**: Decomposed 144-line component into focused modules

    -   Split into 4 files: Main component (40 lines), Physics hook (68 lines), Movement utils (100 lines), Ground detection hook (28 lines)
    -   Extracted complex movement calculations into pure `firstPersonMovement.ts` utility functions
    -   Created reusable `usePlayerPhysics` hook for physics state management
    -   Separated ground detection logic into focused `useGroundDetection` hook
    -   Eliminated cyclomatic complexity violation (complexity 11) through function decomposition
    -   Achieved compliance with 100 LOC strict limit for core logic components

-   **PauseMenu Component**: Decomposed 120-line component into focused modules

    -   Split into 4 files: Main component (96 lines), Hook (37 lines), Utils (48 lines), Constants (18 lines)
    -   Extracted state management into `usePauseMenu` hook for reusability
    -   Separated complex switch logic into `executeMenuAction` utility function
    -   Moved menu options data to `pauseMenuConstants.ts` for maintainability
    -   Eliminated cyclomatic complexity violation through focused function design
    -   Achieved compliance with 100 LOC strict limit for UI components

-   **Soundtrack Module**: Decomposed 107-line soundtrackData.ts into focused modules

    -   Split into 3 files: Constants (65 lines), Utils (29 lines), Main API (44 lines)
    -   Separated data from logic with `soundtrackConstants.ts` for pure data
    -   Extracted reusable utilities into `soundtrackUtils.ts` for array operations
    -   Maintained backward compatibility through re-exports in main API
    -   Achieved compliance with 100 LOC strict limit for core logic files

-   **AudioPlayer Component**: Decomposed monolithic 509-line component into focused modules

    -   Split into 4 UI components: Controls (42 lines), Progress (53 lines), Volume (25 lines), Main (78 lines)
    -   Extracted audio logic into reusable `useAudioPlayer` hook (225 lines)
    -   Organized components in `/audio` subdirectory for better file structure
    -   Eliminated 2 cyclomatic complexity violations through focused function design
    -   Achieved full compliance with directory-based LOC enforcement

### Documentation

-   **README Consolidation**: Refactored documentation structure for better accessibility

    -   Consolidated comprehensive project information from `docs/Portal/README.md` into root `README.md`
    -   Enhanced root README with complete tech stack, features, project structure, and development philosophy
    -   Removed redundant docs README to eliminate duplication
    -   Improved project discoverability by making key information visible at repository root
    -   Technical documentation remains organized in `docs/Portal/` folder for detailed specifications

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
