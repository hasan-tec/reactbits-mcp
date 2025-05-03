/**
 * Grid Motion
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

import GridMotion from './GridMotion';

// note: you'll need to make sure the parent container of this component is sized properly
const items = [
'Item 1',
<div key='jsx-item-1'>Custom JSX Content</div>,
'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
'Item 2',
<div key='jsx-item-2'>Custom JSX Content</div>,
'Item 4',
<div key='jsx-item-2'>Custom JSX Content</div>,
'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
'Item 5',
<div key='jsx-item-2'>Custom JSX Content</div>,
'Item 7',
<div key='jsx-item-2'>Custom JSX Content</div>,
'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
'Item 8',
<div key='jsx-item-2'>Custom JSX Content</div>,
'Item 10',
<div key='jsx-item-3'>Custom JSX Content</div>,
'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
'Item 11',
<div key='jsx-item-2'>Custom JSX Content</div>,
'Item 13',
<div key='jsx-item-4'>Custom JSX Content</div>,
'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
'Item 14',
// Add more items as needed
];

<GridMotion items={items} />

import { useEffect, useRef } from 'react';

import { gsap } from 'gsap';

const GridMotion = ({ items = [], gradientColor = 'black' }) => {
const gridRef = useRef(null);
const rowRefs = useRef([]); // Array of refs for each row
const mouseXRef = useRef(window.innerWidth / 2);

// Ensure the grid has 28 items (4 rows x 7 columns) by default
const totalItems = 28;
const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);
const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems;

useEffect(() => {
gsap.ticker.lagSmoothing(0);

const handleMouseMove = (e) => {
mouseXRef.current = e.clientX;
};

const updateMotion = () => {
const maxMoveAmount = 300;
const baseDuration = 0.8; // Base duration for inertia
const inertiaFactors = [0.6, 0.4, 0.3, 0.2]; // Different inertia for each row, outer rows slower

rowRefs.current.forEach((row, index) => {
if (row) {
const direction = index % 2 === 0 ? 1 : -1;
const moveAmount = ((mouseXRef.current / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) * direction;

// Apply inertia and staggered stop
gsap.to(row, {
x: moveAmount,
duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
ease: 'power3.out',
overwrite: 'auto',
});
}
});
};

const removeAnimationLoop = gsap.ticker.add(updateMotion);
window.addEventListener('mousemove', handleMouseMove);

return () => {
window.removeEventListener('mousemove', handleMouseMove);
removeAnimationLoop();
};
}, []);

return (
<div ref={gridRef} className="h-full w-full overflow-hidden">
<section
className="w-full h-screen overflow-hidden relative flex items-center justify-center"
style={{
background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`,
}}
>
{/* Noise overlay */}
<div
className="absolute inset-0 pointer-events-none z-[4] bg-[url('../../../assets/noise.png')] bg-[length:250px]"
></div>
<div
className="gap-4 flex-none relative w-[150vw] h-[150vh] grid grid-rows-4 grid-cols-1 rotate-[-15deg] origin-center z-[2]"
>
{[...Array(4)].map((_, rowIndex) => (
<div
key={rowIndex}
className="grid gap-4 grid-cols-7"
style={{ willChange: 'transform, filter' }}
ref={(el) => (rowRefs.current[rowIndex] = el)}
>
{[...Array(7)].map((_, itemIndex) => {
const content = combinedItems[rowIndex * 7 + itemIndex];
return (
<div key={itemIndex} className="relative">
<div
className="relative w-full h-full overflow-hidden rounded-[10px] bg-[#111] flex items-center justify-center text-white text-[1.5rem]"
>
{typeof content === 'string' && content.startsWith('http') ? (
<div
className="w-full h-full bg-cover bg-center absolute top-0 left-0"
style={{ backgroundImage: `url(${content})` }}
></div>
) : (
<div className="p-4 text-center z-[1]">{content}</div>
)}
</div>
</div>
);
})}
</div>
))}
</div>
<div className="relative w-full h-full top-0 left-0 pointer-events-none"></div>
</section>
</div>
);
};

export default GridMotion;

import './GridMotion.css';

const GridMotion = ({ items = [], gradientColor = 'black' }) => {
const gridRef = useRef(null);
const rowRefs = useRef([]); // Array of refs for each row
const mouseXRef = useRef(window.innerWidth / 2);

// Ensure the grid has 28 items (4 rows x 7 columns) by default
const totalItems = 28;
const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);
const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems;

useEffect(() => {
gsap.ticker.lagSmoothing(0);

const handleMouseMove = (e) => {
mouseXRef.current = e.clientX;
};

const updateMotion = () => {
const maxMoveAmount = 300;
const baseDuration = 0.8; // Base duration for inertia
const inertiaFactors = [0.6, 0.4, 0.3, 0.2]; // Different inertia for each row, outer rows slower

rowRefs.current.forEach((row, index) => {
if (row) {
const direction = index % 2 === 0 ? 1 : -1;
const moveAmount = ((mouseXRef.current / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) * direction;

// Apply inertia and staggered stop
gsap.to(row, {
x: moveAmount,
duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
ease: 'power3.out',
overwrite: 'auto',
});
}
});
};

const removeAnimationLoop = gsap.ticker.add(updateMotion);

window.addEventListener('mousemove', handleMouseMove);

return () => {
window.removeEventListener('mousemove', handleMouseMove);
removeAnimationLoop(); // Properly remove the ticker listener
};
}, []);

return (
<div className="noscroll loading" ref={gridRef}>
<section
className="intro"
style={{
background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`,
}}
>
<div className="gridMotion-container">
{[...Array(4)].map((_, rowIndex) => (
<div
key={rowIndex}
className="row"
ref={(el) => (rowRefs.current[rowIndex] = el)} // Set each row's ref
>
{[...Array(7)].map((_, itemIndex) => {
const content = combinedItems[rowIndex * 7 + itemIndex];
return (
<div key={itemIndex} className="row__item">
<div className="row__item-inner" style={{ backgroundColor: '#111' }}>
{typeof content === 'string' && content.startsWith('http') ? (
<div
className="row__item-img"
style={{
backgroundImage: `url(${content})`,
}}
></div>
) : (
<div className="row__item-content">{content}</div>
)}
</div>
</div>
);
})}
</div>
))}
</div>
<div className="fullview"></div>
</section>
</div>
);
};

export default GridMotion;


.noscroll {
height: 100%;
width: 100%;
overflow: hidden;
}

.intro {
width: 100%;
height: 100vh;
overflow: hidden;
position: relative;
display: flex;
align-items: center;
justify-content: center;
}

.intro::after {
content: "";
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: url('../../../assets/noise.png');
background-size: 250px;
pointer-events: none;
z-index: 4;
}

.gridMotion-container {
gap: 1rem;
flex: none;
position: relative;
width: 150vw;
height: 150vh;
display: grid;
grid-template-rows: repeat(4, 1fr);
grid-template-columns: 100%;
transform: rotate(-15deg);
transform-origin: center center;
z-index: 2;
}

.row {
display: grid;
gap: 1rem;
grid-template-columns: repeat(7, 1fr);
will-change: transform, filter;
}

.row__item {
position: relative;
}

.row__item-inner {
position: relative;
width: 100%;
height: 100%;
overflow: hidden;
border-radius: 10px;
background-color: #111;
display: flex;
align-items: center;
justify-content: center;
color: white;
font-size: 1.5rem;
}

.row__item-img {
width: 100%;
height: 100%;
background-size: cover;
background-position: 50% 50%;
position: absolute;
top: 0;
left: 0;
}

.row__item-content {
padding: 1rem;
text-align: center;
z-index: 1;
}

.fullview {
position: relative;
width: 100%;
height: 100%;
top: 0;
left: 0;
pointer-events: none;
}

.fullview .row__item-inner {
border-radius: 0px;
}
