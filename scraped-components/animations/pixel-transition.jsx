/**
 * Pixel Transition
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

npm i gsap

import PixelTransition from './PixelTransition';

<PixelTransition
firstContent={
<img
src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg"
alt="default pixel transition content, a cat!"
style={{ width: "100%", height: "100%", objectFit: "cover" }}
/>
}
secondContent={
<div
style={{
width: "100%",
height: "100%",
display: "grid",
placeItems: "center",
backgroundColor: "#111"
}}
>
<p style={{ fontWeight: 900, fontSize: "3rem", color: "#ffffff" }}>Meow!</p>
</div>
}
gridSize={12}
pixelColor='#ffffff'
animationStepDuration={0.4}
className="custom-pixel-card"
/>

import { useRef, useEffect, useState } from 'react';

import { gsap } from 'gsap';

function PixelTransition({
firstContent,
secondContent,
gridSize = 7,
pixelColor = 'currentColor',
animationStepDuration = 0.3,
className = '',
style = {},
aspectRatio = '100%',
}) {
const containerRef = useRef(null);
const pixelGridRef = useRef(null);
const activeRef = useRef(null);
const delayedCallRef = useRef(null);

const [isActive, setIsActive] = useState(false);

const isTouchDevice =
'ontouchstart' in window ||
navigator.maxTouchPoints > 0 ||
window.matchMedia('(pointer: coarse)').matches;

useEffect(() => {
const pixelGridEl = pixelGridRef.current;
if (!pixelGridEl) return;

pixelGridEl.innerHTML = '';

for (let row = 0; row < gridSize; row++) {
for (let col = 0; col < gridSize; col++) {
const pixel = document.createElement('div');
pixel.classList.add('pixelated-image-card__pixel');
pixel.classList.add('absolute', 'hidden');
pixel.style.backgroundColor = pixelColor;

const size = 100 / gridSize;
pixel.style.width = `${size}%`;
pixel.style.height = `${size}%`;
pixel.style.left = `${col * size}%`;
pixel.style.top = `${row * size}%`;

pixelGridEl.appendChild(pixel);
}
}
}, [gridSize, pixelColor]);

const animatePixels = (activate) => {
setIsActive(activate);

const pixelGridEl = pixelGridRef.current;
const activeEl = activeRef.current;
if (!pixelGridEl || !activeEl) return;

const pixels = pixelGridEl.querySelectorAll('.pixelated-image-card__pixel');
if (!pixels.length) return;

gsap.killTweensOf(pixels);
if (delayedCallRef.current) {
delayedCallRef.current.kill();
}

gsap.set(pixels, { display: 'none' });

const totalPixels = pixels.length;
const staggerDuration = animationStepDuration / totalPixels;

gsap.to(pixels, {
display: 'block',
duration: 0,
stagger: {
each: staggerDuration,
from: 'random'
}
});

delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
activeEl.style.display = activate ? 'block' : 'none';
activeEl.style.pointerEvents = activate ? 'none' : '';
});

gsap.to(pixels, {
display: 'none',
duration: 0,
delay: animationStepDuration,
stagger: {
each: staggerDuration,
from: 'random'
}
});
};

const handleMouseEnter = () => {
if (!isActive) animatePixels(true);
};
const handleMouseLeave = () => {
if (isActive) animatePixels(false);
};
const handleClick = () => {
animatePixels(!isActive);
};

return (
<div
ref={containerRef}
// Combine your own className with the Tailwind classes for styling
className={`
${className}
bg-[#222]
text-white
rounded-[15px]
border-2
border-white
w-[300px]
max-w-full
relative
overflow-hidden
`}
style={style}
onMouseEnter={!isTouchDevice ? handleMouseEnter : undefined}
onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
onClick={isTouchDevice ? handleClick : undefined}
>
<div style={{ paddingTop: aspectRatio }} />

<div className="absolute inset-0 w-full h-full">
{firstContent}
</div>

<div
ref={activeRef}
className="absolute inset-0 w-full h-full z-[2]"
style={{ display: 'none' }}
>
{secondContent}
</div>

<div
ref={pixelGridRef}
className="absolute inset-0 w-full h-full pointer-events-none z-[3]"
/>
</div>
);
}

export default PixelTransition;

import './PixelTransition.css';

function PixelTransition({
firstContent,
secondContent,
gridSize = 7,
pixelColor = 'currentColor',
animationStepDuration = 0.3,
className = '',
style = {},
aspectRatio = '100%',
}) {
const containerRef = useRef(null);
const pixelGridRef = useRef(null);
const activeRef = useRef(null);
const delayedCallRef = useRef(null);

const [isActive, setIsActive] = useState(false);

const isTouchDevice =
'ontouchstart' in window ||
navigator.maxTouchPoints > 0 ||
window.matchMedia('(pointer: coarse)').matches;

useEffect(() => {
const pixelGridEl = pixelGridRef.current;
if (!pixelGridEl) return;

pixelGridEl.innerHTML = '';

for (let row = 0; row < gridSize; row++) {
for (let col = 0; col < gridSize; col++) {
const pixel = document.createElement('div');
pixel.classList.add('pixelated-image-card__pixel');
pixel.style.backgroundColor = pixelColor;

const size = 100 / gridSize;
pixel.style.width = `${size}%`;
pixel.style.height = `${size}%`;
pixel.style.left = `${col * size}%`;
pixel.style.top = `${row * size}%`;
pixelGridEl.appendChild(pixel);
}
}
}, [gridSize, pixelColor]);

const animatePixels = (activate) => {
setIsActive(activate);

const pixelGridEl = pixelGridRef.current;
const activeEl = activeRef.current;
if (!pixelGridEl || !activeEl) return;

const pixels = pixelGridEl.querySelectorAll('.pixelated-image-card__pixel');
if (!pixels.length) return;

gsap.killTweensOf(pixels);
if (delayedCallRef.current) {
delayedCallRef.current.kill();
}

gsap.set(pixels, { display: 'none' });

const totalPixels = pixels.length;
const staggerDuration = animationStepDuration / totalPixels;

gsap.to(pixels, {
display: 'block',
duration: 0,
stagger: {
each: staggerDuration,
from: 'random'
}
});

delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
activeEl.style.display = activate ? 'block' : 'none';
activeEl.style.pointerEvents = activate ? 'none' : '';
});

gsap.to(pixels, {
display: 'none',
duration: 0,
delay: animationStepDuration,
stagger: {
each: staggerDuration,
from: 'random'
}
});
};

const handleMouseEnter = () => {
if (!isActive) animatePixels(true);
};
const handleMouseLeave = () => {
if (isActive) animatePixels(false);
};
const handleClick = () => {
animatePixels(!isActive);
};

return (
<div
ref={containerRef}
className={`pixelated-image-card ${className}`}
style={style}
onMouseEnter={!isTouchDevice ? handleMouseEnter : undefined}
onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
onClick={isTouchDevice ? handleClick : undefined}
>
<div style={{ paddingTop: aspectRatio }} />
<div className="pixelated-image-card__default">
{firstContent}
</div>
<div className="pixelated-image-card__active" ref={activeRef}>
{secondContent}
</div>
<div className="pixelated-image-card__pixels" ref={pixelGridRef} />
</div>
);
}

export default PixelTransition;


.pixelated-image-card {
background-color: #222;
color: var(--color-primary, #fff);
border-radius: 15px;
border: 2px solid #fff;
width: 300px;
max-width: 100%;
position: relative;
overflow: hidden;
}

.pixelated-image-card__default,
.pixelated-image-card__active,
.pixelated-image-card__pixels {
width: 100%;
height: 100%;
position: absolute;
top: 0;
left: 0;
}

.pixelated-image-card__active {
z-index: 2;
}

.pixelated-image-card__active {
display: none;
}

.pixelated-image-card__pixels {
pointer-events: none;
position: absolute;
z-index: 3;
top: 0;
left: 0;
width: 100%;
height: 100%;
}

.pixelated-image-card__pixel {
display: none;
position: absolute;
}
