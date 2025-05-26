# Wheatley Behavior Ideas Summary

## Core Interactive Behaviors

- **Mouse Tracking**: Wheatley follows user's cursor position in real-time
- **Distraction States**: Occasionally gets distracted by random points in the environment
- **Self-Correction**: Gives himself a little "shake" when realizing he's been distracted
- **Idle Fidgeting**: Small rotational movements even when cursor is stationary

## Menu Reactivity

- **Single Player Menu**: Shows excitement when user hovers over Single Player option
- **Multiplayer Menu**: Looks between Atlas and P-body models when Multiplayer is hovered
- **Options Menu**: Adopts a "thinking" pose when Options menu is selected
- **Audio Settings**: Shows particular interest when audio settings are accessed

## Advanced Personality Behaviors

- **Nervous Spinning**: Complete 360° rotation when cursor moves too quickly
- **Sleepy Mode**: Eye slowly closes if cursor remains still for extended period
- **Light Flickering**: Occasional eye light flicker followed by surprised reaction
- **Proximity Reaction**: Slight backward movement if cursor gets too close
- **Curious Inspection**: Focuses intently on specific screen elements temporarily
- **Excitement Bursts**: Quick rotations when user clicks a menu option
- **Speech Bubbles**: Occasional Portal quotes appearing as speech bubbles
- **Environmental Awareness**: Looks at UI elements showing awareness of surroundings
- **Mischievous Movement**: Brief attempts to "trick" cursor by moving opposite direction
- **Recognition Patterns**: Develops "anticipation" of user's movement patterns

## Implementation Architecture

- **Model Layer**: 3D visual assets with no behavior (What Wheatley looks like)
- **Rig Layer**: Animation capabilities without decision logic (What Wheatley can do)
- **Blackboard**: Data storage for world state and inputs (What Wheatley knows)
- **Behavior System**: Decision-making logic determining actions (How Wheatley thinks)
