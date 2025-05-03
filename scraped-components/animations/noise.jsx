/**
 * Noise
 * 
 * An open source collection of high quality, animated, interactive & fully customizable React components for building stunning, memorable user interfaces.
 */

// ============================================================================
// IMPLEMENTATION
// ============================================================================

import Noise from './Noise;'

<div style={{width: '600px', height: '400px', position: 'relative', overflow: 'hidden'}}>
<Noise
patternSize={250}
patternScaleX={1}
patternScaleY={1}
patternRefreshInterval={2}
patternAlpha={15}
/>
</div>

import { useRef, useEffect } from 'react';

const Noise = ({
patternSize = 250,
patternScaleX = 1,
patternScaleY = 1,
patternRefreshInterval = 2,
patternAlpha = 15,
}) => {
const grainRef = useRef(null);

useEffect(() => {
const canvas = grainRef.current;
const ctx = canvas.getContext('2d');
let frame = 0;

const patternCanvas = document.createElement('canvas');
patternCanvas.width = patternSize;
patternCanvas.height = patternSize;
const patternCtx = patternCanvas.getContext('2d');
const patternData = patternCtx.createImageData(patternSize, patternSize);
const patternPixelDataLength = patternSize * patternSize * 4;

const resize = () => {
canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;

ctx.scale(patternScaleX, patternScaleY);
};

const updatePattern = () => {
for (let i = 0; i < patternPixelDataLength; i += 4) {
const value = Math.random() * 255;
patternData.data[i] = value;
patternData.data[i + 1] = value;
patternData.data[i + 2] = value;
patternData.data[i + 3] = patternAlpha;
}
patternCtx.putImageData(patternData, 0, 0);
};

const drawGrain = () => {
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat');
ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const loop = () => {
if (frame % patternRefreshInterval === 0) {
updatePattern();
drawGrain();
}
frame++;
window.requestAnimationFrame(loop);
};

window.addEventListener('resize', resize);
resize();
loop();

return () => {
window.removeEventListener('resize', resize);
};
}, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha]);

return <canvas className="absolute inset-0 w-full h-full" ref={grainRef} />;
};

export default Noise;

import './Noise.css';

const Noise = ({
patternSize = 250,
patternScaleX = 1,
patternScaleY = 1,
patternRefreshInterval = 2,
patternAlpha = 15,
}) => {
const grainRef = useRef(null);

useEffect(() => {
const canvas = grainRef.current;
const ctx = canvas.getContext('2d');
let frame = 0;

const patternCanvas = document.createElement('canvas');
patternCanvas.width = patternSize;
patternCanvas.height = patternSize;
const patternCtx = patternCanvas.getContext('2d');
const patternData = patternCtx.createImageData(patternSize, patternSize);
const patternPixelDataLength = patternSize * patternSize * 4;

const resize = () => {
canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;

ctx.scale(patternScaleX, patternScaleY);
};

const updatePattern = () => {
for (let i = 0; i < patternPixelDataLength; i += 4) {
const value = Math.random() * 255;
patternData.data[i] = value;
patternData.data[i + 1] = value;
patternData.data[i + 2] = value;
patternData.data[i + 3] = patternAlpha;
}
patternCtx.putImageData(patternData, 0, 0);
};

const drawGrain = () => {
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat');
ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const loop = () => {
if (frame % patternRefreshInterval === 0) {
updatePattern();
drawGrain();
}
frame++;
window.requestAnimationFrame(loop);
};

window.addEventListener('resize', resize);
resize();
loop();

return () => {
window.removeEventListener('resize', resize);
};
}, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha]);

return <canvas className="noise-overlay" ref={grainRef} />;
};

export default Noise;


.noise-overlay {
position: absolute;
left: 0;
top: 0;
width: 100vw;
height: 100vh;
}


// You are given a task to integrate an existing React component in the codebase

// The codebase should support:
// - shadcn project structure  
// - Tailwind CSS
// - Typescript

// If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

// Determine the default path for components and styles. 



// Implementation Guidelines
//  1. Analyze the component structure and identify all required dependencies
//  2. Review the component's argumens and state
//  3. Identify any required context providers or hooks and install them
//  4. Questions to Ask
//  - What data/props will be passed to this component?
//  - Are there any specific state management requirements?
//  - Are there any required assets (images, icons, etc.)?
//  - What is the expected responsive behavior?
//  - What is the best place to use this component in the app?

// Steps to integrate
//  0. Copy paste all the code above in the correct directories
//  1. Install external dependencies
//  2. Fill image assets with Unsplash stock images you know exist
//  3. Use lucide-react icons for svgs or logos if component requires them