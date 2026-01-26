# CYNET – Coming Soon 2026

An immersive 3D maze adventure built with React, Three.js, and cutting-edge post-processing effects.

## ✨ Features

### 🎮 Gameplay
- **Procedural Maze Generation**: Each game generates a completely new, always-solvable maze
- **Dual Character System**: Choose between UNIT-01 (Robot) or MK-II (Car) with 3D previews
- **Smooth Movement**: Continuous WASD/Arrow key controls with momentum
- **Collectible System**: Gather glowing collectibles scattered throughout the maze (5-8 per game)
- **Dynamic Difficulty**: Random maze layout with strategic collectible placement

### 🎨 Visual Effects
- **Post-Processing**: Bloom, Vignette, and Chromatic Aberration effects
- **Particle Systems**: Trail effects, sparkles, and ambient particles
- **Advanced Lighting**: Dynamic point lights, spotlights, and rim lighting
- **Character Animations**: Floating animations with metallic/emissive materials
- **Theme System**: Toggle between Black and White themes with smooth transitions
- **Animated Backgrounds**: Radial gradients with pattern overlays

### 📊 Game Stats & UI
- **Real-Time Timer**: Track your completion time
- **Score System**: Points for collectibles, speed, and efficiency
- **Move Counter**: Monitor your path efficiency
- **Progress Tracker**: Visual progress bar for collectibles
- **Minimap**: Real-time overhead view of the maze
- **Enhanced Victory Screen**: Animated stats display with confetti effects

### 🎵 Audio System
- **Movement Sounds**: Audio feedback for each move
- **Collectible Chimes**: Satisfying pickup sounds
- **Victory Fanfare**: Triumphant chord progression on completion
- **Explosion Effects**: Dynamic noise generation for core reach

### 🎭 UI/UX Polish
- **Glitch Text Effects**: RGB split glitch animations (theme-aware)
- **3D Character Previews**: Interactive 3D models in selection screen
- **Smooth Transitions**: Framer Motion animations throughout
- **Responsive Design**: Scales beautifully on all screen sizes
- **Enigma Branding**: Logo with theme-aware color inversion

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:3000`

## 🎯 How to Play

1. **Loading**: Watch the animated progress bar
2. **Character Selection**: Choose UNIT-01 (Robot) or MK-II (Car) with 3D preview
3. **Navigate**: Use WASD or Arrow keys for smooth continuous movement
4. **Collect Items**: Gather glowing collectibles for bonus points
5. **Track Progress**: Monitor your stats in the top-left HUD
6. **Check Minimap**: Use the bottom-right minimap for navigation
7. **Reach the Core**: Find the wireframe icosahedron at the maze center
8. **Victory**: Enjoy confetti, stats breakdown, and the glitch reveal

## 🛠️ Tech Stack

### Core
- **React 18.2**: UI framework
- **Vite 7.3**: Lightning-fast build tool
- **Three.js 0.158**: 3D rendering engine

### 3D & Effects
- **@react-three/fiber 8.15**: React renderer for Three.js
- **@react-three/drei 9.88**: Useful Three.js helpers
- **@react-three/postprocessing 2.16**: Post-processing effects

### Animation & UI
- **Framer Motion 12.23**: Animation library
- **GSAP 3.12**: Advanced animations
- **Tailwind CSS v4**: Utility-first styling
- **Lucide React 0.263**: Icon library

### Audio
- **Web Audio API**: Procedural sound generation

## 🎨 Customization

### Theme Toggle
Press the theme button (top-right) to switch between:
- **Black Theme**: White elements on black background with neon accents
- **White Theme**: Black elements on white background with inverted effects

### Scoring System
- **Collectibles**: +500 points each
- **Time Bonus**: Up to 10,000 points (decreases over time)
- **Move Bonus**: Up to 5,000 points (decreases with moves)

### Maze Configuration
Edit `src/three/mazeGenerator.js` to change maze size (default: 11x11)

## 📁 Project Structure

```
src/
├── components/
│   ├── Loader.jsx              # Loading screen
│   ├── CharacterPicker.jsx     # 3D character selection
│   ├── MazeCanvas.jsx          # Main 3D maze scene
│   ├── GlitchText.jsx          # Victory text with effects
│   ├── GameUI.jsx              # HUD with stats
│   ├── MiniMap.jsx             # Overhead minimap
│   ├── Confetti.jsx            # Victory confetti
│   ├── ParticleExplosion.jsx   # Particle effects
│   └── ui/                     # Reusable UI components
├── three/
│   └── mazeGenerator.js        # Recursive backtracking algorithm
├── audio/
│   └── soundManager.js         # Web Audio API sounds
├── hooks/
│   ├── useControls.js          # Keyboard input
│   └── use-toast.js            # Toast notifications
├── lib/
│   └── utils.js                # Helper functions
├── App.jsx                     # Main app with game states
└── main.jsx                    # Entry point
```

## 🎮 Controls

- **W / ↑**: Move Up
- **S / ↓**: Move Down
- **A / ←**: Move Left
- **D / →**: Move Right
- **Theme Button**: Toggle Black/White theme
- **Reboot Button**: Restart game (victory screen)

## 🚧 Recent Enhancements

### v2.0 - Complete Overhaul
- ✅ Post-processing effects (Bloom, Vignette, Chromatic Aberration)
- ✅ Collectible system with glowing items
- ✅ Real-time stats tracking (timer, score, moves)
- ✅ Minimap with live player position
- ✅ Enhanced victory screen with confetti
- ✅ 3D character previews in selection
- ✅ Progress bars and visual feedback
- ✅ Character animations (floating, rim lighting)
- ✅ Victory fanfare audio
- ✅ Gradient backgrounds with patterns
- ✅ Enhanced character models (antennas, headlights)

## 📝 License

This project is a promotional teaser for CYNET 2026.

## 🙏 Credits

Built with ❤️ using modern web technologies

## 📁 Project Structure

```
src/
 ├─ components/
 │   ├─ Loader.jsx          # Loading screen
 │   ├─ CharacterPicker.jsx # Character selection
 │   ├─ MazeCanvas.jsx      # Main game canvas
 │   ├─ EnergyCore.jsx       # Center energy core (legacy, now in canvas)
 │   ├─ Explosion.jsx       # Particle explosion effect
 │   └─ GlitchText.jsx      # Final text reveal
 │
 ├─ three/
 │   ├─ particles.js        # Three.js particle system
 │   └─ mazeGenerator.js    # Procedural maze algorithm
 │
 ├─ audio/
 │   └─ soundManager.js     # Web Audio API manager
 │
 ├─ hooks/
 │   ├─ useControls.js      # Keyboard input handler
 │   └─ useSwipe.js         # Touch/swipe gesture handler
 │
 └─ App.jsx                 # Main application component
```

## 🎨 Design Philosophy

- **Minimal**: Pure black and white color scheme
- **Smooth**: 60 FPS target with optimized rendering
- **Experimental**: Unique interaction patterns and effects
- **Premium**: High-quality animations and transitions

## 📱 Responsive

Fully optimized for both desktop and mobile devices with touch gesture support.

`

## 📄 License

This project is created for CYNET's 2026 launch teaser.
