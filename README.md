# Portal Three.js

A browser-based recreation of Valve's Portal using React Three Fiber, bringing the iconic puzzle-platformer experience to the web with authentic physics, mechanics, and atmosphere.

## Vision

Portal Three.js aims to capture the essence of Portal's innovative gameplay, memorable characters, and distinctive aesthetic in a modern web environment. Built with performance and accessibility in mind, this project demonstrates what's possible when cutting-edge web technologies meet timeless game design.

## Live Demo

🎮 **<a href="https://thomasmatlock.com/play/portal" target="_blank">Play Portal Three.js</a>**

Experience the full game with player authentication, automatic progress saving, seamless co-op multiplayer, AI-generated voice dialog, physics simulation, and Easter eggs.

## Features

-   **Authentic Portal Mechanics**: Physics-based portal gun, momentum conservation, and spatial puzzles
-   **Player Authentication**: Google OAuth integration for seamless login and user management
-   **Progress Saving**: Automatic progress persistence with cloud synchronization via Supabase
-   **Co-op Multiplayer**: Seamless multiplayer experience with shared puzzle solving and friend invitations
-   **AI-Generated Dialog**: Dynamic GLaDOS and Wheatley voice lines using ElevenLabs integration
-   **Immersive Audio**: Spatial audio with contextual character interactions
-   **Professional UI**: Clean menu system with single player, multiplayer, and options
-   **Easter Eggs**: Hidden details and references for Portal fans to discover

## Tech Stack

### Core Framework

-   **Next.js 13** - React framework with app directory structure
-   **TypeScript** - Type-safe development throughout

### 3D & Graphics

-   **React Three Fiber** - Declarative Three.js in React
-   **React Three Drei** - Useful helpers and abstractions
-   **React Three Rapier** - Physics simulation with Rapier
-   **React Three PostProcessing** - Visual effects pipeline

### Animation & Interaction

-   **Maath** - Mathematical utilities for 3D
-   **React Device Detect** - Platform-specific optimizations

### Audio & AI

-   **ElevenLabs** - AI voice generation for dynamic dialog
-   **Spatial Audio** - Immersive 3D audio positioning

### Authentication & Data

-   **Google OAuth** - Secure player authentication and identity management
-   **Supabase** - Backend-as-a-Service for progress saving, user data, and real-time features

### Multiplayer & Networking

-   **Colyseus** - Real-time multiplayer server framework for seamless co-op gameplay

### Development

-   **ESLint** - Code quality and consistency
-   **Sass** - Enhanced styling capabilities
-   **Cloudflare** - Deployment and edge optimization

## Project Structure

```
portal-threejs/
├── components/
│   ├── audio/          # Sound systems and voice controllers
│   ├── core/           # Game state and fundamental systems
│   ├── effects/        # Post-processing and visual effects
│   ├── environment/    # Lighting, atmosphere, and world setup
│   ├── maps/           # Level components and test chambers
│   └── ui/             # Interface and HUD elements
├── docs/Portal/        # Game design documentation
├── hooks/              # Reusable React hooks
├── models/             # 3D assets and character models
├── public/             # Static assets and textures
├── styles/             # Global styles and theme
└── utils/              # Shared utilities and helpers
```

## Current Status

✅ **Live Production**

-   **Deployed and playable** at <a href="https://thomasmatlock.com/play/portal" target="_blank">thomasmatlock.com/play/portal</a>
-   **Featured on portfolio** as award-winning project showcase
-   Complete menu system with single player and multiplayer modes
-   AI-generated character dialog with GLaDOS and Wheatley
-   Modular animation system with optimized performance

🚧 **Active Development**

-   Enhanced Portal mechanics and physics
-   Additional test chambers and puzzle complexity
-   Advanced multiplayer features and synchronization
-   Performance optimizations for broader device support

## Development Philosophy

This project follows clear, pragmatic development principles:

-   **Clarity over cleverness** - Readable, maintainable code
-   **Separation of concerns** - Modular, decoupled architecture
-   **Incremental progress** - Small, focused commits
-   **Performance conscious** - Optimized for smooth 60fps gameplay

## Documentation

For detailed documentation:

-   **[📝 CHANGELOG.md](CHANGELOG.md)** - Development milestones and refactoring history
-   **[📖 docs/Portal/](docs/Portal/)** - Game design, mechanics, and technical specifications
-   **[⚙️ docs/Portal/principles_enforcement.md](docs/Portal/principles_enforcement.md)** - Code quality guidelines and automated enforcement

## License

This project is a non-commercial recreation for educational and demonstration purposes. Portal is a trademark of Valve Corporation.

## Acknowledgments

-   **Valve Corporation** - For creating the original Portal universe
-   **React Three Fiber Team** - For making 3D web development accessible
-   **Portal Community** - For inspiration and continued passion for the franchise

---

_"The cake is a lie, but the code is real."_
