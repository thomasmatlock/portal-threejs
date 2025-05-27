# Implementation Architecture for Wheatley

## 1. UIContext (Blackboard)
**File: `UIContext.js`**
- React Context Provider that stores all interactive state
- Contains no logic, only data storage
- Examples of stored data:
  ```javascript
  {
    cursorPosition: { x: 0.5, y: 0.3 },
    hoveredMenu: "singlePlayer", // or null, "multiplayer", "options", etc.
    activeMenu: "main", // or "options", "singlePlayer", etc.
    menuPositions: { 
      singlePlayer: { x: -0.5, y: 0.2 },
      // other menu positions
    },
    lastInteraction: Date.now(),
    userActivity: true
  }
  ```
- Updated by event handlers throughout the application
- Used as your shared data store that all components can access

## 2. WheatleyBehaviorTree (Controller/AI)
**File: `WheatleyBehaviorTree.js`**
- Consumes the UIContext
- Contains all decision-making logic
- Determines which animations/actions should play based on context
- Example structure:
  ```javascript
  function WheatleyBehaviorTree({ rig }) {
    const { cursorPosition, hoveredMenu } = useUIContext();
    const [internalState, setInternalState] = useState({
      isDistracted: false,
      distractionTimer: 0,
      // other internal AI state
    });
    
    // Decision-making logic
    useEffect(() => {
      if (hoveredMenu === "singlePlayer") {
        rig.lookAtMenuOption("singlePlayer");
        rig.playAnimation("excited");
      } else if (internalState.isDistracted) {
        // Handle distraction behavior
      } else {
        rig.lookAt(cursorPosition);
      }
      
      // Add chance to get distracted
      // etc.
    }, [cursorPosition, hoveredMenu, internalState]);
    
    return null; // This component doesn't render anything
  }
  ```
- Runs behavior tree or state machine logic to control the rig

## 3. WheatleyRig (Animation Controller)
**File: `WheatleyRig.js`**
- Handles all animation and movement capabilities
- Provides methods that the behavior tree can call
- No decision-making, just execution of commands
- Example structure:
  ```javascript
  function WheatleyRig({ mesh, behaviorTree }) {
    // Animation mixers, etc.
    
    // Methods called by the behavior tree
    const lookAt = (position) => {
      // Rotate mesh to look at position
    };
    
    const shake = () => {
      // Play head shake animation
    };
    
    const playAnimation = (animName) => {
      // Play the requested animation
    };
    
    // Expose methods to behavior tree
    useEffect(() => {
      if (behaviorTree) {
        behaviorTree.setRig({
          lookAt,
          shake,
          playAnimation
        });
      }
    }, [behaviorTree]);
    
    return null; // Or return the mesh component
  }
  ```
- Focuses exclusively on making Wheatley move and animate correctly

## 4. WheatleyMesh (3D Model)
**File: `WheatleyMesh.js`**
- Contains just the 3D model and materials
- No behavior, just visual appearance
- Example structure:
  ```javascript
  function WheatleyMesh() {
    const { scene } = useLoader(GLTFLoader, '/models/wheatley.glb');
    
    // Set up materials, geometries
    useEffect(() => {
      // Configure materials, etc.
    }, [scene]);
    
    return <primitive object={scene} />;
  }
  ```
- May include references to specific parts (eye, body) for the rig to manipulate

## Integration
**File: `Wheatley.js`**
```javascript
function Wheatley() {
  const [rig, setRig] = useState(null);
  
  return (
    <>
      <WheatleyMesh ref={setMesh} />
      <WheatleyRig mesh={mesh} ref={setRig} />
      <WheatleyBehaviorTree rig={rig} />
    </>
  );
}
```

This architecture gives you:
1. Clean separation of concerns
2. Easily modifiable behavior without touching animation code
3. Reusable components (the rig and behavior tree could control different models)
4. Clear data flow from user input through decision-making to visual output

Your existing UIContext already serves as the blackboard, making this architecture a natural evolution of your current implementation.​​​​​​​​​​​​​​​​