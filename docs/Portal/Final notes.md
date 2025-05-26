# Implementation Priority Notes

## Mixamo Animation Integration
- Use pre-made Mixamo animations with Atlas and P-body rigged models
- Download humanoid animations in FBX or glTF format
- Implement animation state machine for transitions between animations
- Apply different animations based on menu context and user interactions

## Google Authentication
- Implement after player completes level 2
- Show unobtrusive prompt: "Want to save your progress?"
- Connect with Supabase backend for progress storage
- Enable automatic save/resume across devices
- Store player progress, completed levels, and statistics

## Particle Preview Transitions
- Create blue/orange particles (matching portal colors)
- Implement for transitions between menu characters:
  - Current model dissolves into colored particles
  - Particles flow/swirl across screen
  - Reform into next character model
- Use blue particles for Atlas, orange for P-body
- Add interactive physics to allow particles to react to cursor movement

These three features will significantly enhance the Portal Three.js experience with professional-quality animations, persistent progress, and visually striking transitions.​​​​​​​​​​​​​​​​