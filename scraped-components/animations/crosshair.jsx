/**
 * Crosshair
 * 
 * An open source collection of high quality, animated, interactive & fully customizable React components for building stunning, memorable user interfaces.
 */

// ============================================================================
// IMPLEMENTATION
// ============================================================================

npm i gsap

import { useRef } from 'react';

import Crosshair from './Crosshair';

const Component = () => {
const containerRef = useRef(null);

return (
<div ref={containerRef} style={{ height: '300px', overflow: 'hidden' }}>
<Crosshair containerRef={containerRef} color='#ffffff'/> // containerRef defaults to "window" if not provided
</div>
)
};

import { useEffect, useRef } from "react";

import { gsap } from "gsap";

const lerp = (a, b, n) => (1 - n) * a + n * b;

const getMousePos = (e, container) => {
if (container) {
const bounds = container.getBoundingClientRect();
return {
x: e.clientX - bounds.left,
y: e.clientY - bounds.top,
};
}
return { x: e.clientX, y: e.clientY };
};

const Crosshair = ({ color = "white", containerRef = null }) => {
const cursorRef = useRef(null);
const lineHorizontalRef = useRef(null);
const lineVerticalRef = useRef(null);
const filterXRef = useRef(null);
const filterYRef = useRef(null);

let mouse = { x: 0, y: 0 };

useEffect(() => {
const handleMouseMove = (ev) => {
// eslint-disable-next-line react-hooks/exhaustive-deps
mouse = getMousePos(ev, containerRef?.current);

if (containerRef?.current) {
const bounds = containerRef.current.getBoundingClientRect();
if (
ev.clientX < bounds.left ||
ev.clientX > bounds.right ||
ev.clientY < bounds.top ||
ev.clientY > bounds.bottom
) {
gsap.to([lineHorizontalRef.current, lineVerticalRef.current], {
opacity: 0,
});
} else {
gsap.to([lineHorizontalRef.current, lineVerticalRef.current], {
opacity: 1,
});
}
}
};

const target = containerRef?.current || window;
target.addEventListener("mousemove", handleMouseMove);

const renderedStyles = {
tx: { previous: 0, current: 0, amt: 0.15 },
ty: { previous: 0, current: 0, amt: 0.15 },
};

gsap.set([lineHorizontalRef.current, lineVerticalRef.current], {
opacity: 0,
});

const onMouseMove = () => {
renderedStyles.tx.previous = renderedStyles.tx.current = mouse.x;
renderedStyles.ty.previous = renderedStyles.ty.current = mouse.y;

gsap.to([lineHorizontalRef.current, lineVerticalRef.current], {
duration: 0.9,
ease: "Power3.easeOut",
opacity: 1,
});

requestAnimationFrame(render);

target.removeEventListener("mousemove", onMouseMove);
};

target.addEventListener("mousemove", onMouseMove);

const primitiveValues = { turbulence: 0 };

const tl = gsap
.timeline({
paused: true,
onStart: () => {
lineHorizontalRef.current.style.filter = `url(#filter-noise-x)`;
lineVerticalRef.current.style.filter = `url(#filter-noise-y)`;
},
onUpdate: () => {
filterXRef.current.setAttribute(
"baseFrequency",
primitiveValues.turbulence
);
filterYRef.current.setAttribute(
"baseFrequency",
primitiveValues.turbulence
);
},
onComplete: () => {
lineHorizontalRef.current.style.filter = lineVerticalRef.current.style.filter = "none";
},
})
.to(primitiveValues, {
duration: 0.5,
ease: "power1",
startAt: { turbulence: 1 },
turbulence: 0,
});

const enter = () => tl.restart();
const leave = () => tl.progress(1).kill();

const render = () => {
renderedStyles.tx.current = mouse.x;
renderedStyles.ty.current = mouse.y;

for (const key in renderedStyles) {
renderedStyles[key].previous = lerp(
renderedStyles[key].previous,
renderedStyles[key].current,
renderedStyles[key].amt
);
}

gsap.set(lineVerticalRef.current, { x: renderedStyles.tx.previous });
gsap.set(lineHorizontalRef.current, { y: renderedStyles.ty.previous });

requestAnimationFrame(render);
};

const links = containerRef?.current
? containerRef.current.querySelectorAll("a")
: document.querySelectorAll("a");

links.forEach((link) => {
link.addEventListener("mouseenter", enter);
link.addEventListener("mouseleave", leave);
});

return () => {
target.removeEventListener("mousemove", handleMouseMove);
target.removeEventListener("mousemove", onMouseMove);
links.forEach((link) => {
link.removeEventListener("mouseenter", enter);
link.removeEventListener("mouseleave", leave);
});
};
}, [containerRef]);

return (
<div
ref={cursorRef}
className={`${
containerRef ? "absolute" : "fixed"
} top-0 left-0 w-full h-full pointer-events-none z-[10000]`}
>
<svg className="absolute top-0 left-0 w-full h-full">
<defs>
<filter id="filter-noise-x">
<feTurbulence
type="fractalNoise"
baseFrequency="0.000001"
numOctaves="1"
ref={filterXRef}
/>
<feDisplacementMap in="SourceGraphic" scale="40" />
</filter>
<filter id="filter-noise-y">
<feTurbulence
type="fractalNoise"
baseFrequency="0.000001"
numOctaves="1"
ref={filterYRef}
/>
<feDisplacementMap in="SourceGraphic" scale="40" />
</filter>
</defs>
</svg>
<div
ref={lineHorizontalRef}
className={`absolute w-full h-px pointer-events-none opacity-0 transform translate-y-1/2`}
style={{ background: color }}
></div>
<div
ref={lineVerticalRef}
className={`absolute h-full w-px pointer-events-none opacity-0 transform translate-x-1/2`}
style={{ background: color }}
></div>
</div>
);
};

export default Crosshair;

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