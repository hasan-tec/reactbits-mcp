/**
 * Dock
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

npm i framer-motion

import Dock from './Dock';

const items = [
{ icon: <VscHome size={18} />, label: 'Home', onClick: () => alert('Home!') },
{ icon: <VscArchive size={18} />, label: 'Archive', onClick: () => alert('Archive!') },
{ icon: <VscAccount size={18} />, label: 'Profile', onClick: () => alert('Profile!') },
{ icon: <VscSettingsGear size={18} />, label: 'Settings', onClick: () => alert('Settings!') },
];

<Dock 
items={items}
panelHeight={68}
baseItemSize={50}
magnification={70}
/>

"use client";

import {
Children,
cloneElement,
useEffect,
useMemo,
useRef,
useState,
} from "react";

function DockItem({
children,
className = "",
onClick,
mouseX,
spring,
distance,
magnification,
baseItemSize,
}) {
const ref = useRef(null);
const isHovered = useMotionValue(0);

const mouseDistance = useTransform(mouseX, (val) => {
const rect = ref.current?.getBoundingClientRect() ?? {
x: 0,
width: baseItemSize,
};
return val - rect.x - baseItemSize / 2;
});

const targetSize = useTransform(
mouseDistance,
[-distance, 0, distance],
[baseItemSize, magnification, baseItemSize]
);
const size = useSpring(targetSize, spring);

return (
<motion.div
ref={ref}
style={{
width: size,
height: size,
}}
onHoverStart={() => isHovered.set(1)}
onHoverEnd={() => isHovered.set(0)}
onFocus={() => isHovered.set(1)}
onBlur={() => isHovered.set(0)}
onClick={onClick}
className={`relative inline-flex items-center justify-center rounded-full bg-[#060606] border-neutral-700 border-2 shadow-md ${className}`}
tabIndex={0}
role="button"
aria-haspopup="true"
>
{Children.map(children, (child) =>
cloneElement(child, { isHovered })
)}
</motion.div>
);
}

function DockLabel({ children, className = "", ...rest }) {
const { isHovered } = rest;
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
const unsubscribe = isHovered.on("change", (latest) => {
setIsVisible(latest === 1);
});
return () => unsubscribe();
}, [isHovered]);

return (
<AnimatePresence>
{isVisible && (
<motion.div
initial={{ opacity: 0, y: 0 }}
animate={{ opacity: 1, y: -10 }}
exit={{ opacity: 0, y: 0 }}
transition={{ duration: 0.2 }}
className={`${className} absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-neutral-700 bg-[#060606] px-2 py-0.5 text-xs text-white`}
role="tooltip"
style={{ x: "-50%" }}
>
{children}
</motion.div>
)}
</AnimatePresence>
);
}

function DockIcon({ children, className = "" }) {
return (
<div className={`flex items-center justify-center ${className}`}>
{children}
</div>
);
}

export default function Dock({
items,
className = "",
spring = { mass: 0.1, stiffness: 150, damping: 12 },
magnification = 70,
distance = 200,
panelHeight = 64,
dockHeight = 256,
baseItemSize = 50,
}) {
const mouseX = useMotionValue(Infinity);
const isHovered = useMotionValue(0);

const maxHeight = useMemo(
() => Math.max(dockHeight, magnification + magnification / 2 + 4),
[magnification, dockHeight]
);
const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
const height = useSpring(heightRow, spring);

return (
<motion.div
style={{ height, scrollbarWidth: "none" }}
className="mx-2 flex max-w-full items-center"
>
<motion.div
onMouseMove={({ pageX }) => {
isHovered.set(1);
mouseX.set(pageX);
}}
onMouseLeave={() => {
isHovered.set(0);
mouseX.set(Infinity);
}}
className={`${className} absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-end w-fit gap-4 rounded-2xl border-neutral-700 border-2 pb-2 px-4`}
style={{ height: panelHeight }}
role="toolbar"
aria-label="Application dock"
>
{items.map((item, index) => (
<DockItem
key={index}
onClick={item.onClick}
className={item.className}
mouseX={mouseX}
spring={spring}
distance={distance}
magnification={magnification}
baseItemSize={baseItemSize}
>
<DockIcon>{item.icon}</DockIcon>
<DockLabel>{item.label}</DockLabel>
</DockItem>
))}
</motion.div>
</motion.div>
);
}

import "./Dock.css";

function DockItem({
children,
className = "",
onClick,
mouseX,
spring,
distance,
magnification,
baseItemSize,
}) {
const ref = useRef(null);
const isHovered = useMotionValue(0);

const mouseDistance = useTransform(mouseX, (val) => {
const rect = ref.current?.getBoundingClientRect() ?? {
x: 0,
width: baseItemSize,
};
return val - rect.x - baseItemSize / 2;
});

const targetSize = useTransform(
mouseDistance,
[-distance, 0, distance],
[baseItemSize, magnification, baseItemSize]
);
const size = useSpring(targetSize, spring);

return (
<motion.div
ref={ref}
style={{
width: size,
height: size,
}}
onHoverStart={() => isHovered.set(1)}
onHoverEnd={() => isHovered.set(0)}
onFocus={() => isHovered.set(1)}
onBlur={() => isHovered.set(0)}
onClick={onClick}
className={`dock-item ${className}`}
tabIndex={0}
role="button"
aria-haspopup="true"
>
{Children.map(children, (child) =>
cloneElement(child, { isHovered })
)}
</motion.div>
);
}

function DockLabel({ children, className = "", ...rest }) {
const { isHovered } = rest;
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
const unsubscribe = isHovered.on("change", (latest) => {
setIsVisible(latest === 1);
});
return () => unsubscribe();
}, [isHovered]);

return (
<AnimatePresence>
{isVisible && (
<motion.div
initial={{ opacity: 0, y: 0 }}
animate={{ opacity: 1, y: -10 }}
exit={{ opacity: 0, y: 0 }}
transition={{ duration: 0.2 }}
className={`dock-label ${className}`}
role="tooltip"
style={{ x: "-50%" }}
>
{children}
</motion.div>
)}
</AnimatePresence>
);
}

function DockIcon({ children, className = "" }) {
return <div className={`dock-icon ${className}`}>{children}</div>;
}

export default function Dock({
items,
className = "",
spring = { mass: 0.1, stiffness: 150, damping: 12 },
magnification = 70,
distance = 200,
panelHeight = 68,
dockHeight = 256,
baseItemSize = 50,
}) {
const mouseX = useMotionValue(Infinity);
const isHovered = useMotionValue(0);

const maxHeight = useMemo(
() => Math.max(dockHeight, magnification + magnification / 2 + 4),
[magnification, dockHeight]
);
const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
const height = useSpring(heightRow, spring);

return (
<motion.div
style={{ height, scrollbarWidth: "none" }}
className="dock-outer"
>
<motion.div
onMouseMove={({ pageX }) => {
isHovered.set(1);
mouseX.set(pageX);
}}
onMouseLeave={() => {
isHovered.set(0);
mouseX.set(Infinity);
}}
className={`dock-panel ${className}`}
style={{ height: panelHeight }}
role="toolbar"
aria-label="Application dock"
>
{items.map((item, index) => (
<DockItem
key={index}
onClick={item.onClick}
className={item.className}
mouseX={mouseX}
spring={spring}
distance={distance}
magnification={magnification}
baseItemSize={baseItemSize}
>
<DockIcon>{item.icon}</DockIcon>
<DockLabel>{item.label}</DockLabel>
</DockItem>
))}
</motion.div>
</motion.div>
);
}


.dock-outer {
margin: 0 0.5rem;
display: flex;
max-width: 100%;
align-items: center;
}

.dock-panel {
position: absolute;
bottom: 0.5rem;
left: 50%;
transform: translateX(-50%);
display: flex;
align-items: flex-end;
width: fit-content;
gap: 1rem;
border-radius: 1rem;
background-color: #060606;
border: 1px solid #222;
padding: 0 0.5rem 0.5rem;
}

.dock-item {
position: relative;
display: inline-flex;
align-items: center;
justify-content: center;
border-radius: 10px;
background-color: #060606;
border: 1px solid #222;
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
0 2px 4px -1px rgba(0, 0, 0, 0.06);
cursor: pointer;
outline: none;
}

.dock-icon {
display: flex;
align-items: center;
justify-content: center;
}

.dock-label {
position: absolute;
top: -1.5rem;
left: 50%;
width: fit-content;
white-space: pre;
border-radius: 0.375rem;
border: 1px solid #222;
background-color: #060606;
padding: 0.125rem 0.5rem;
font-size: 0.75rem;
color: #fff;
transform: translateX(-50%);
}

"use client";
