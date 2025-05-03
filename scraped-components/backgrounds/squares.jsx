/**
 * Squares
 * 
 * An open source collection of high quality, animated, interactive & fully customizable React components for building stunning, memorable user interfaces.
 */
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
// ============================================================================
// IMPLEMENTATION
// ============================================================================

import Squares from './Squares';

<Squares 
speed={0.5} 
squareSize={40}
direction='diagonal' // up, down, left, right, diagonal
borderColor='#fff'
hoverFillColor='#222'
/>

import { useRef, useEffect } from "react";

const Squares = ({
direction = "right",
speed = 1,
borderColor = "#999",
squareSize = 40,
hoverFillColor = "#222",
}) => {
const canvasRef = useRef(null);
const requestRef = useRef(null);
const numSquaresX = useRef(0);
const numSquaresY = useRef(0);
const gridOffset = useRef({ x: 0, y: 0 });
const hoveredSquareRef = useRef(null);

useEffect(() => {
const canvas = canvasRef.current;
if (!canvas) return;
const ctx = canvas.getContext("2d");

const resizeCanvas = () => {
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
};

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const drawGrid = () => {
if (!ctx) return;

ctx.clearRect(0, 0, canvas.width, canvas.height);

const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
const squareX = x - (gridOffset.current.x % squareSize);
const squareY = y - (gridOffset.current.y % squareSize);

if (
hoveredSquareRef.current &&
Math.floor((x - startX) / squareSize) ===
hoveredSquareRef.current.x &&
Math.floor((y - startY) / squareSize) === hoveredSquareRef.current.y
) {
ctx.fillStyle = hoverFillColor;
ctx.fillRect(squareX, squareY, squareSize, squareSize);
}

ctx.strokeStyle = borderColor;
ctx.strokeRect(squareX, squareY, squareSize, squareSize);
}
}

const gradient = ctx.createRadialGradient(
canvas.width / 2,
canvas.height / 2,
0,
canvas.width / 2,
canvas.height / 2,
Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
);
gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
gradient.addColorStop(1, "#060606");

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const updateAnimation = () => {
const effectiveSpeed = Math.max(speed, 0.1);
switch (direction) {
case "right":
gridOffset.current.x =
(gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
break;
case "left":
gridOffset.current.x =
(gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
break;
case "up":
gridOffset.current.y =
(gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
break;
case "down":
gridOffset.current.y =
(gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
break;
case "diagonal":
gridOffset.current.x =
(gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
gridOffset.current.y =
(gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
break;
default:
break;
}

drawGrid();
requestRef.current = requestAnimationFrame(updateAnimation);
};

const handleMouseMove = (event) => {
const rect = canvas.getBoundingClientRect();
const mouseX = event.clientX - rect.left;
const mouseY = event.clientY - rect.top;

const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

const hoveredSquareX = Math.floor(
(mouseX + gridOffset.current.x - startX) / squareSize
);
const hoveredSquareY = Math.floor(
(mouseY + gridOffset.current.y - startY) / squareSize
);

if (
!hoveredSquareRef.current ||
hoveredSquareRef.current.x !== hoveredSquareX ||
hoveredSquareRef.current.y !== hoveredSquareY
) {
hoveredSquareRef.current = { x: hoveredSquareX, y: hoveredSquareY };
}
};

const handleMouseLeave = () => {
hoveredSquareRef.current = null;
};

canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseleave", handleMouseLeave);
requestRef.current = requestAnimationFrame(updateAnimation);

return () => {
window.removeEventListener("resize", resizeCanvas);
if (requestRef.current) cancelAnimationFrame(requestRef.current);
canvas.removeEventListener("mousemove", handleMouseMove);
canvas.removeEventListener("mouseleave", handleMouseLeave);
};
}, [direction, speed, borderColor, hoverFillColor, squareSize]);

return (
<canvas
ref={canvasRef}
className="w-full h-full border-none block"
></canvas>
);
};

export default Squares;

import './Squares.css';

const Squares = ({
direction = 'right',
speed = 1,
borderColor = '#999',
squareSize = 40,
hoverFillColor = '#222',
className = ''
}) => {
const canvasRef = useRef(null);
const requestRef = useRef(null);
const numSquaresX = useRef();
const numSquaresY = useRef();
const gridOffset = useRef({ x: 0, y: 0 });
const hoveredSquare = useRef(null);

useEffect(() => {
const canvas = canvasRef.current;
const ctx = canvas.getContext('2d');

const resizeCanvas = () => {
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const drawGrid = () => {
ctx.clearRect(0, 0, canvas.width, canvas.height);

const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
const squareX = x - (gridOffset.current.x % squareSize);
const squareY = y - (gridOffset.current.y % squareSize);

if (
hoveredSquare.current &&
Math.floor((x - startX) / squareSize) === hoveredSquare.current.x &&
Math.floor((y - startY) / squareSize) === hoveredSquare.current.y
) {
ctx.fillStyle = hoverFillColor;
ctx.fillRect(squareX, squareY, squareSize, squareSize);
}

ctx.strokeStyle = borderColor;
ctx.strokeRect(squareX, squareY, squareSize, squareSize);
}
}

const gradient = ctx.createRadialGradient(
canvas.width / 2,
canvas.height / 2,
0,
canvas.width / 2,
canvas.height / 2,
Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
);
gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
// gradient.addColorStop(1, '#060606'); // uncomment for gradient

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const updateAnimation = () => {
const effectiveSpeed = Math.max(speed, 0.1);
switch (direction) {
case 'right':
gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
break;
case 'left':
gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
break;
case 'up':
gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
break;
case 'down':
gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
break;
case 'diagonal':
gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
break;
default:
break;
}

drawGrid();
requestRef.current = requestAnimationFrame(updateAnimation);
};

const handleMouseMove = (event) => {
const rect = canvas.getBoundingClientRect();
const mouseX = event.clientX - rect.left;
const mouseY = event.clientY - rect.top;

const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

const hoveredSquareX = Math.floor((mouseX + gridOffset.current.x - startX) / squareSize);
const hoveredSquareY = Math.floor((mouseY + gridOffset.current.y - startY) / squareSize);

if (
!hoveredSquare.current ||
hoveredSquare.current.x !== hoveredSquareX ||
hoveredSquare.current.y !== hoveredSquareY
) {
hoveredSquare.current = { x: hoveredSquareX, y: hoveredSquareY };
}
};

const handleMouseLeave = () => {
hoveredSquare.current = null;
};

canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseleave', handleMouseLeave);

requestRef.current = requestAnimationFrame(updateAnimation);

return () => {
window.removeEventListener('resize', resizeCanvas);
cancelAnimationFrame(requestRef.current);
canvas.removeEventListener('mousemove', handleMouseMove);
canvas.removeEventListener('mouseleave', handleMouseLeave);
};
}, [direction, speed, borderColor, hoverFillColor, squareSize]);

return <canvas ref={canvasRef} className={`squares-canvas ${className}`}></canvas>;
};

export default Squares;


.squares-canvas {
width: 100%;
height: 100%;
border: none;
display: block;
}
