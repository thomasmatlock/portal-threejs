# Portal Three.js

A browser-based recreation of Valve's Portal using React Three Fiber, bringing the iconic puzzle-platformer experience to the web with authentic physics, mechanics, and atmosphere.

## Vision

Portal Three.js aims to capture the essence of Portal's innovative gameplay, memorable characters, and distinctive aesthetic in a modern web environment. Built with performance and accessibility in mind, this project demonstrates what's possible when cutting-edge web technologies meet timeless game design.

## Features

-   **Authentic Portal Mechanics**: Physics-based portal gun, momentum conservation, and spatial puzzles
-   **Dynamic Characters**: GLaDOS, Wheatley, Atlas, and P-Body with contextual AI-generated dialog
-   **Immersive Audio**: Spatial audio with ElevenLabs integration for dynamic character voices

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

-   **GSAP** - High-performance animations
-   **Maath** - Mathematical utilities for 3D
-   **React Device Detect** - Platform-specific optimizations

### Audio & AI

-   **ElevenLabs** - AI voice generation for dynamic dialog
-   **Spatial Audio** - Immersive 3D audio positioning

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
├── models/             # 3D assets and character models
├── public/             # Static assets and textures
├── styles/             # Global styles and theme
└── utils/              # Shared utilities and helpers
```

## Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/portal-threejs.git
cd portal-threejs

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the project in action.

## Current Progress

✅ **Project Foundation**

-   Component architecture established
-   Asset organization and build pipeline
-   Development environment configured

🚧 **In Development**

-   In-game menu system
-   Wheatley Three.js integration
-   Core Portal mechanics implementation

📋 **Planned Features**

-   Complete test chamber suite
-   Advanced Portal physics
-   Character AI and dialog system
-   Performance optimizations

## Development Philosophy

This project follows clear, pragmatic development principles:

-   **Clarity over cleverness** - Readable, maintainable code
-   **Separation of concerns** - Modular, decoupled architecture
-   **Incremental progress** - Small, focused commits
-   **Performance conscious** - Optimized for smooth 60fps gameplay

## Contributing

This project is currently in active development. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is a non-commercial recreation for educational and demonstration purposes. Portal is a trademark of Valve Corporation.

## Acknowledgments

-   **Valve Corporation** - For creating the original Portal universe
-   **React Three Fiber Team** - For making 3D web development accessible
-   **Portal Community** - For inspiration and continued passion for the franchise

---

_"The cake is a lie, but the code is real."_
