/**
 * Carousel
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

npm install framer-motion

import Carousel from './Carousel'

<div style={{ height: '600px', position: 'relative' }}>
<Carousel
baseWidth={300}
autoplay={true}
autoplayDelay={3000}
pauseOnHover={true}
loop={true}
round={false}
/>
</div>

import { useEffect, useState, useRef } from "react";

import { motion, useMotionValue, useTransform } from "framer-motion";
// replace icons with your own if needed

import { FiCircle, FiCode, FiFileText, FiLayers, FiLayout } from "react-icons/fi";

import "./Carousel.css";

const DEFAULT_ITEMS = [
{
title: "Text Animations",
description: "Cool text animations for your projects.",
id: 1,
icon: <FiFileText className="carousel-icon" />,
},
{
title: "Animations",
description: "Smooth animations for your projects.",
id: 2,
icon: <FiCircle className="carousel-icon" />,
},
{
title: "Components",
description: "Reusable components for your projects.",
id: 3,
icon: <FiLayers className="carousel-icon" />,
},
{
title: "Backgrounds",
description: "Beautiful backgrounds and patterns for your projects.",
id: 4,
icon: <FiLayout className="carousel-icon" />,
},
{
title: "Common UI",
description: "Common UI components are coming soon!",
id: 5,
icon: <FiCode className="carousel-icon" />,
},
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

export default function Carousel({
items = DEFAULT_ITEMS,
baseWidth = 300,
autoplay = false,
autoplayDelay = 3000,
pauseOnHover = false,
loop = false,
round = false,
}) {
const containerPadding = 16;
const itemWidth = baseWidth - containerPadding * 2;
const trackItemOffset = itemWidth + GAP;

const carouselItems = loop ? [...items, items[0]] : items;
const [currentIndex, setCurrentIndex] = useState(0);
const x = useMotionValue(0);
const [isHovered, setIsHovered] = useState(false);
const [isResetting, setIsResetting] = useState(false);

const containerRef = useRef(null);
useEffect(() => {
if (pauseOnHover && containerRef.current) {
const container = containerRef.current;
const handleMouseEnter = () => setIsHovered(true);
const handleMouseLeave = () => setIsHovered(false);
container.addEventListener("mouseenter", handleMouseEnter);
container.addEventListener("mouseleave", handleMouseLeave);
return () => {
container.removeEventListener("mouseenter", handleMouseEnter);
container.removeEventListener("mouseleave", handleMouseLeave);
};
}
}, [pauseOnHover]);

useEffect(() => {
if (autoplay && (!pauseOnHover || !isHovered)) {
const timer = setInterval(() => {
setCurrentIndex((prev) => {
if (prev === items.length - 1 && loop) {
return prev + 1;
}
if (prev === carouselItems.length - 1) {
return loop ? 0 : prev;
}
return prev + 1;
});
}, autoplayDelay);
return () => clearInterval(timer);
}
}, [
autoplay,
autoplayDelay,
isHovered,
loop,
items.length,
carouselItems.length,
pauseOnHover,
]);

const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

const handleAnimationComplete = () => {
if (loop && currentIndex === carouselItems.length - 1) {
setIsResetting(true);
x.set(0);
setCurrentIndex(0);
setTimeout(() => setIsResetting(false), 50);
}
};

const handleDragEnd = (_, info) => {
const offset = info.offset.x;
const velocity = info.velocity.x;
if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
if (loop && currentIndex === items.length - 1) {
setCurrentIndex(currentIndex + 1); // Go to clone.
} else {
setCurrentIndex((prev) => Math.min(prev + 1, carouselItems.length - 1));
}
} else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
if (loop && currentIndex === 0) {
setCurrentIndex(items.length - 1);
} else {
setCurrentIndex((prev) => Math.max(prev - 1, 0));
}
}
};

const dragProps = loop
? {}
: {
dragConstraints: {
left: -trackItemOffset * (carouselItems.length - 1),
right: 0,
},
};

return (
<div
ref={containerRef}
className={`carousel-container ${round ? "round" : ""}`}
style={{
width: `${baseWidth}px`,
...(round && { height: `${baseWidth}px`, borderRadius: "50%" }),
}}
>
<motion.div
className="carousel-track"
drag="x"
{...dragProps}
style={{
width: itemWidth,
gap: `${GAP}px`,
perspective: 1000,
perspectiveOrigin: `${currentIndex * trackItemOffset + itemWidth / 2}px 50%`,
x,
}}
onDragEnd={handleDragEnd}
animate={{ x: -(currentIndex * trackItemOffset) }}
transition={effectiveTransition}
onAnimationComplete={handleAnimationComplete}
>
{carouselItems.map((item, index) => {
const range = [
-(index + 1) * trackItemOffset,
-index * trackItemOffset,
-(index - 1) * trackItemOffset,
];
const outputRange = [90, 0, -90];
// eslint-disable-next-line react-hooks/rules-of-hooks
const rotateY = useTransform(x, range, outputRange, { clamp: false });
return (
<motion.div
key={index}
className={`carousel-item ${round ? "round" : ""}`}
style={{
width: itemWidth,
height: round ? itemWidth : "100%",
rotateY: rotateY,
...(round && { borderRadius: "50%" }),
}}
transition={effectiveTransition}
>
<div className={`carousel-item-header ${round ? "round" : ""}`}>
<span className="carousel-icon-container">
{item.icon}
</span>
</div>
<div className="carousel-item-content">
<div className="carousel-item-title">{item.title}</div>
<p className="carousel-item-description">{item.description}</p>
</div>
</motion.div>
);
})}
</motion.div>
<div className={`carousel-indicators-container ${round ? "round" : ""}`}>
<div className="carousel-indicators">
{items.map((_, index) => (
<motion.div
key={index}
className={`carousel-indicator ${currentIndex % items.length === index ? "active" : "inactive"
}`}
animate={{
scale: currentIndex % items.length === index ? 1.2 : 1,
}}
onClick={() => setCurrentIndex(index)}
transition={{ duration: 0.15 }}
/>
))}
</div>
</div>
</div>
);
}


/* Container */
.carousel-container {
position: relative;
overflow: hidden;
border: 1px solid #555;
border-radius: 24px;
padding: 16px;
/* This padding is taken into account for item width */
--outer-r: 24px;
--p-distance: 12px;
}

/* Track */
.carousel-track {
display: flex;
}

/* Carousel item */
.carousel-item {
position: relative;
display: flex;
flex-shrink: 0;
flex-direction: column;
align-items: flex-start;
justify-content: space-between;
border: 1px solid #555;
border-radius: calc(var(--outer-r) - var(--p-distance));
background-color: #0D0D0D;
overflow: hidden;
cursor: grab;
}

.carousel-item:active {
cursor: grabbing;
}

.carousel-container.round {
border: 1px solid #555;
}

.carousel-item.round {
background-color: #0D0D0D;
position: relative;
bottom: .1em;
border: 1px solid #555;
justify-content: center;
align-items: center;
text-align: center;
}

.carousel-item-header.round {
padding: 0;
margin: 0;
}

.carousel-indicators-container.round {
position: absolute;
z-index: 2;
bottom: 3em;
left: 50%;
transform: translateX(-50%);
}

.carousel-indicator.active {
background-color: #333333;
}

.carousel-indicator.inactive {
background-color: rgba(51, 51, 51, 0.4);
}

.carousel-item-header {
margin-bottom: 16px;
padding: 20px;
padding-top: 20px;
}

.carousel-icon-container {
display: flex;
height: 28px;
width: 28px;
align-items: center;
justify-content: center;
border-radius: 50%;
background-color: #fff;
}

.carousel-icon {
height: 16px;
width: 16px;
color: #060606;
}

.carousel-item-content {
padding: 20px;
padding-bottom: 20px;
}

.carousel-item-title {
margin-bottom: 4px;
font-weight: 900;
font-size: 18px;
color: #fff;
}

.carousel-item-description {
font-size: 14px;
color: #fff;
}

/* Indicators */
.carousel-indicators-container {
display: flex;
width: 100%;
justify-content: center;
}

.carousel-indicators {
margin-top: 16px;
display: flex;
width: 150px;
justify-content: space-between;
padding: 0 32px;
}

.carousel-indicator {
height: 8px;
width: 8px;
border-radius: 50%;
cursor: pointer;
transition: background-color 150ms;
}

.carousel-indicator.active {
background-color: #fff;
}

.carousel-indicator.inactive {
background-color: #555;
}

import {
FiCircle,
FiCode,
FiFileText,
FiLayers,
FiLayout,
} from "react-icons/fi";

const DEFAULT_ITEMS = [
{
title: "Text Animations",
description: "Cool text animations for your projects.",
id: 1,
icon: <FiFileText className="h-[16px] w-[16px] text-white" />,
},
{
title: "Animations",
description: "Smooth animations for your projects.",
id: 2,
icon: <FiCircle className="h-[16px] w-[16px] text-white" />,
},
{
title: "Components",
description: "Reusable components for your projects.",
id: 3,
icon: <FiLayers className="h-[16px] w-[16px] text-white" />,
},
{
title: "Backgrounds",
description: "Beautiful backgrounds and patterns for your projects.",
id: 4,
icon: <FiLayout className="h-[16px] w-[16px] text-white" />,
},
{
title: "Common UI",
description: "Common UI components are coming soon!",
id: 5,
icon: <FiCode className="h-[16px] w-[16px] text-white" />,
},
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

export default function Carousel({
items = DEFAULT_ITEMS,
baseWidth = 300,
autoplay = false,
autoplayDelay = 3000,
pauseOnHover = false,
loop = false,
round = false,
}) {
const containerPadding = 16;
const itemWidth = baseWidth - containerPadding * 2;
const trackItemOffset = itemWidth + GAP;

const carouselItems = loop ? [...items, items[0]] : items;
const [currentIndex, setCurrentIndex] = useState(0);
const x = useMotionValue(0);
const [isHovered, setIsHovered] = useState(false);
const [isResetting, setIsResetting] = useState(false);

const containerRef = useRef(null);
useEffect(() => {
if (pauseOnHover && containerRef.current) {
const container = containerRef.current;
const handleMouseEnter = () => setIsHovered(true);
const handleMouseLeave = () => setIsHovered(false);
container.addEventListener("mouseenter", handleMouseEnter);
container.addEventListener("mouseleave", handleMouseLeave);
return () => {
container.removeEventListener("mouseenter", handleMouseEnter);
container.removeEventListener("mouseleave", handleMouseLeave);
};
}
}, [pauseOnHover]);

useEffect(() => {
if (autoplay && (!pauseOnHover || !isHovered)) {
const timer = setInterval(() => {
setCurrentIndex((prev) => {
if (prev === items.length - 1 && loop) {
return prev + 1; // Animate to clone.
}
if (prev === carouselItems.length - 1) {
return loop ? 0 : prev;
}
return prev + 1;
});
}, autoplayDelay);
return () => clearInterval(timer);
}
}, [
autoplay,
autoplayDelay,
isHovered,
loop,
items.length,
carouselItems.length,
pauseOnHover,
]);

const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

const handleAnimationComplete = () => {
if (loop && currentIndex === carouselItems.length - 1) {
setIsResetting(true);
x.set(0);
setCurrentIndex(0);
setTimeout(() => setIsResetting(false), 50);
}
};

const handleDragEnd = (_, info) => {
const offset = info.offset.x;
const velocity = info.velocity.x;
if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
if (loop && currentIndex === items.length - 1) {
setCurrentIndex(currentIndex + 1);
} else {
setCurrentIndex((prev) => Math.min(prev + 1, carouselItems.length - 1));
}
} else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
if (loop && currentIndex === 0) {
setCurrentIndex(items.length - 1);
} else {
setCurrentIndex((prev) => Math.max(prev - 1, 0));
}
}
};

const dragProps = loop
? {}
: {
dragConstraints: {
left: -trackItemOffset * (carouselItems.length - 1),
right: 0,
},
};

return (
<div
ref={containerRef}
className={`relative overflow-hidden p-4 ${round
? "rounded-full border border-white"
: "rounded-[24px] border border-[#222]"
}`}
style={{
width: `${baseWidth}px`,
...(round && { height: `${baseWidth}px` }),
}}
>
<motion.div
className="flex"
drag="x"
{...dragProps}
style={{
width: itemWidth,
gap: `${GAP}px`,
perspective: 1000,
perspectiveOrigin: `${currentIndex * trackItemOffset + itemWidth / 2}px 50%`,
x,
}}
onDragEnd={handleDragEnd}
animate={{ x: -(currentIndex * trackItemOffset) }}
transition={effectiveTransition}
onAnimationComplete={handleAnimationComplete}
>
{carouselItems.map((item, index) => {
const range = [
-(index + 1) * trackItemOffset,
-index * trackItemOffset,
-(index - 1) * trackItemOffset,
];
const outputRange = [90, 0, -90];
// eslint-disable-next-line react-hooks/rules-of-hooks
const rotateY = useTransform(x, range, outputRange, { clamp: false });
return (
<motion.div
key={index}
className={`relative shrink-0 flex flex-col ${round
? "items-center justify-center text-center bg-[#060606] border-0"
: "items-start justify-between bg-[#222] border border-[#222] rounded-[12px]"
} overflow-hidden cursor-grab active:cursor-grabbing`}
style={{
width: itemWidth,
height: round ? itemWidth : "100%",
rotateY: rotateY,
...(round && { borderRadius: "50%" }),
}}
transition={effectiveTransition}
>
<div className={`${round ? "p-0 m-0" : "mb-4 p-5"}`}>
<span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#060606]">
{item.icon}
</span>
</div>
<div className="p-5">
<div className="mb-1 font-black text-lg text-white">
{item.title}
</div>
<p className="text-sm text-white">{item.description}</p>
</div>
</motion.div>
);
})}
</motion.div>
<div
className={`flex w-full justify-center ${round ? "absolute z-20 bottom-12 left-1/2 -translate-x-1/2" : ""
}`}
>
<div className="mt-4 flex w-[150px] justify-between px-8">
{items.map((_, index) => (
<motion.div
key={index}
className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${currentIndex % items.length === index
? round
? "bg-white"
: "bg-[#333333]"
: round
? "bg-[#555]"
: "bg-[rgba(51,51,51,0.4)]"
}`}
animate={{
scale: currentIndex % items.length === index ? 1.2 : 1,
}}
onClick={() => setCurrentIndex(index)}
transition={{ duration: 0.15 }}
/>
))}
</div>
</div>
</div>
);
}
