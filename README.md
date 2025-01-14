# Cyber Snake Game

A modern, cyber-themed implementation of the classic Snake game built with React and TypeScript, featuring a retro arcade aesthetic with neon visuals and pixel-art styling.

## Required Files for AWS Amplify Deployment

### Essential Files:
```
├── src/                    # All game source code
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── styles/            # CSS styles
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Root component
│   └── main.tsx           # Entry point
├── index.html             # HTML template
├── tsconfig.json          # TypeScript config
├── tsconfig.node.json     # Node-specific TS config
└── package.json           # Dependencies and scripts
```

### Optional Files (Not needed for deployment):
```
├── app.py                 # Flask server (not needed)
├── templates/             # Flask templates (not needed)
├── static/                # Flask static files (not needed)
```

## Features

- 🎮 Responsive game controls (keyboard and touch)
- 🎵 Retro sound effects
- 💾 High score persistence
- 📱 Mobile-friendly design
- 🎨 Cyber-punk aesthetic
- ⚡ Dynamic speed progression

## Technologies

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS with custom animations
- **Audio**: Web Audio API
- **Deployment**: AWS Amplify
- **Version Control**: Git

## AWS Amplify Integration

The AWS Amplify configuration is set up in the following files:
- `src/App.tsx` - Main application component
- `src/components/SnakeGame.tsx` - Core game component
- `index.html` - Entry point with required meta tags for mobile

## Setup and Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

## AWS Amplify Deployment Steps

1. Install the Amplify CLI:
```bash
npm install -g @aws-amplify/cli
```

2. Configure Amplify:
```bash
amplify configure
```

3. Initialize your project:
```bash
amplify init
```

4. Push to Amplify:
```bash
amplify push
```

The game is optimized for AWS Amplify deployment with:
- TypeScript configuration in `tsconfig.json`
- Vite build setup for production
- Responsive design for various screen sizes
- Asset optimization for faster loading

## Performance Optimizations

- Efficient canvas rendering
- RequestAnimationFrame for smooth gameplay
- Memoized components to prevent unnecessary re-renders
- Touch events optimization for mobile devices

## Game Controls

- **Arrow Keys**: Control snake direction
- **Space Bar**: Start/Pause game
- **Touch/Swipe**: Mobile controls