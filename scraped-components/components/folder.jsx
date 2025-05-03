/**
 * Folder
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

import Folder from './Folder'

<div style={{ height: '600px', position: 'relative' }}>
<Folder size={2} color="#00d8ff" className="custom-folder" />
</div>

import { useState } from "react";

const darkenColor = (hex, percent) => {
let color = hex.startsWith("#") ? hex.slice(1) : hex;
if (color.length === 3) {
color = color
.split("")
.map((c) => c + c)
.join("");
}
const num = parseInt(color, 16);
let r = (num >> 16) & 0xff;
let g = (num >> 8) & 0xff;
let b = num & 0xff;
r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
return (
"#" +
((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
);
};

const Folder = ({
color = "#00d8ff",
size = 1,
items = [],
className = "",
}) => {
const maxItems = 3;
const papers = items.slice(0, maxItems);
while (papers.length < maxItems) {
papers.push(null);
}

const [open, setOpen] = useState(false);
const [paperOffsets, setPaperOffsets] = useState(
Array.from({ length: maxItems }, () => ({ x: 0, y: 0 }))
);

const folderBackColor = darkenColor(color, 0.08);
const paper1 = darkenColor("#ffffff", 0.1);
const paper2 = darkenColor("#ffffff", 0.05);
const paper3 = "#ffffff";

const handleClick = () => {
setOpen((prev) => !prev);
if (open) {
setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
}
};

const handlePaperMouseMove = (
e,
index
) => {
if (!open) return;
const rect = e.currentTarget.getBoundingClientRect();
const centerX = rect.left + rect.width / 2;
const centerY = rect.top + rect.height / 2;
const offsetX = (e.clientX - centerX) * 0.15;
const offsetY = (e.clientY - centerY) * 0.15;
setPaperOffsets((prev) => {
const newOffsets = [...prev];
newOffsets[index] = { x: offsetX, y: offsetY };
return newOffsets;
});
};

const handlePaperMouseLeave = (
e,
index
) => {
setPaperOffsets((prev) => {
const newOffsets = [...prev];
newOffsets[index] = { x: 0, y: 0 };
return newOffsets;
});
};

const folderStyle = {
"--folder-color": color,
"--folder-back-color": folderBackColor,
"--paper-1": paper1,
"--paper-2": paper2,
"--paper-3": paper3,
};

// Outer scale style
const scaleStyle = { transform: `scale(${size})` };

const getOpenTransform = (index) => {
if (index === 0) return "translate(-120%, -70%) rotate(-15deg)";
if (index === 1) return "translate(10%, -70%) rotate(15deg)";
if (index === 2) return "translate(-50%, -100%) rotate(5deg)";
return "";
};

return (
<div style={scaleStyle} className={className}>
<div
className={`group relative transition-all duration-200 ease-in cursor-pointer ${!open ? "hover:-translate-y-2" : ""
}`}
style={{
...folderStyle,
transform: open ? "translateY(-8px)" : undefined,
}}
onClick={handleClick}
>
<div
className="relative w-[100px] h-[80px] rounded-tl-0 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]"
style={{ backgroundColor: folderBackColor }}
>
<span
className="absolute z-0 bottom-[98%] left-0 w-[30px] h-[10px] rounded-tl-[5px] rounded-tr-[5px] rounded-bl-0 rounded-br-0"
style={{ backgroundColor: folderBackColor }}
></span>
{/* Render papers */}
{papers.map((item, i) => {
let sizeClasses = "";
if (i === 0) sizeClasses = open ? "w-[70%] h-[80%]" : "w-[70%] h-[80%]";
if (i === 1) sizeClasses = open ? "w-[80%] h-[80%]" : "w-[80%] h-[70%]";
if (i === 2) sizeClasses = open ? "w-[90%] h-[80%]" : "w-[90%] h-[60%]";

const transformStyle = open
? `${getOpenTransform(i)} translate(${paperOffsets[i].x}px, ${paperOffsets[i].y}px)`
: undefined;

return (
<div
key={i}
onMouseMove={(e) => handlePaperMouseMove(e, i)}
onMouseLeave={(e) => handlePaperMouseLeave(e, i)}
className={`absolute z-20 bottom-[10%] left-1/2 transition-all duration-300 ease-in-out ${!open
? "transform -translate-x-1/2 translate-y-[10%] group-hover:translate-y-0"
: "hover:scale-110"
} ${sizeClasses}`}
style={{
...(!open ? {} : { transform: transformStyle }),
backgroundColor: i === 0 ? paper1 : i === 1 ? paper2 : paper3,
borderRadius: "10px",
}}
>
{item}
</div>
);
})}
<div
className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${!open ? "group-hover:[transform:skew(15deg)_scaleY(0.6)]" : ""
}`}
style={{
backgroundColor: color,
borderRadius: "5px 10px 10px 10px",
...(open && { transform: "skew(15deg) scaleY(0.6)" }),
}}
></div>
<div
className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${!open ? "group-hover:[transform:skew(-15deg)_scaleY(0.6)]" : ""
}`}
style={{
backgroundColor: color,
borderRadius: "5px 10px 10px 10px",
...(open && { transform: "skew(-15deg) scaleY(0.6)" }),
}}
></div>
</div>
</div>
</div>
);
};

export default Folder;

import "./Folder.css";

const darkenColor = (hex, percent) => {
let color = hex.startsWith("#") ? hex.slice(1) : hex;
if (color.length === 3) {
color = color
.split("")
.map((c) => c + c)
.join("");
}
const num = parseInt(color, 16);
let r = (num >> 16) & 0xff;
let g = (num >> 8) & 0xff;
let b = num & 0xff;
r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
return (
"#" +
((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
);
};

const Folder = ({
color = "#00d8ff",
size = 1,
items = [],
className = "",
}) => {
const maxItems = 3;
const papers = items.slice(0, maxItems);
while (papers.length < maxItems) {
papers.push(null);
}

const [open, setOpen] = useState(false);
const [paperOffsets, setPaperOffsets] = useState(
Array.from({ length: maxItems }, () => ({ x: 0, y: 0 }))
);

const folderBackColor = darkenColor(color, 0.08);
const paper1 = darkenColor("#ffffff", 0.1);
const paper2 = darkenColor("#ffffff", 0.05);
const paper3 = "#ffffff";

const handleClick = () => {
setOpen((prev) => !prev);
if (open) {
setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
}
};

const handlePaperMouseMove = (
e,
index
) => {
if (!open) return;
const rect = e.currentTarget.getBoundingClientRect();
const centerX = rect.left + rect.width / 2;
const centerY = rect.top + rect.height / 2;
const offsetX = (e.clientX - centerX) * 0.15;
const offsetY = (e.clientY - centerY) * 0.15;
setPaperOffsets((prev) => {
const newOffsets = [...prev];
newOffsets[index] = { x: offsetX, y: offsetY };
return newOffsets;
});
};

const handlePaperMouseLeave = (
e,
index
) => {
setPaperOffsets((prev) => {
const newOffsets = [...prev];
newOffsets[index] = { x: 0, y: 0 };
return newOffsets;
});
};

const folderStyle = {
"--folder-color": color,
"--folder-back-color": folderBackColor,
"--paper-1": paper1,
"--paper-2": paper2,
"--paper-3": paper3,
};

const folderClassName = `folder ${open ? "open" : ""}`.trim();
const scaleStyle = { transform: `scale(${size})` };

return (
<div style={scaleStyle} className={className}>
<div
className={folderClassName}
style={folderStyle}
onClick={handleClick}
>
<div className="folder__back">
{papers.map((item, i) => (
<div
key={i}
className={`paper paper-${i + 1}`}
onMouseMove={(e) => handlePaperMouseMove(e, i)}
onMouseLeave={(e) => handlePaperMouseLeave(e, i)}
style={
open
? ({
"--magnet-x": `${paperOffsets[i]?.x || 0}px`,
"--magnet-y": `${paperOffsets[i]?.y || 0}px`,
})
: {}
}
>
{item}
</div>
))}
<div className="folder__front"></div>
<div className="folder__front right"></div>
</div>
</div>
</div>
);
};

export default Folder;


:root {
--folder-color: #70a1ff;
--folder-back-color: #4785ff;
--paper-1: #e6e6e6;
--paper-2: #f2f2f2;
--paper-3: #ffffff;
}

.folder {
transition: all 0.2s ease-in;
cursor: pointer;
}

.folder:not(.folder--click):hover {
transform: translateY(-8px);
}

.folder:not(.folder--click):hover .paper {
transform: translate(-50%, 0%);
}

.folder:not(.folder--click):hover .folder__front {
transform: skew(15deg) scaleY(0.6);
}

.folder:not(.folder--click):hover .right {
transform: skew(-15deg) scaleY(0.6);
}

.folder.open {
transform: translateY(-8px);
}

.folder.open .paper:nth-child(1) {
transform: translate(-120%, -70%) rotateZ(-15deg);
}

.folder.open .paper:nth-child(1):hover {
transform: translate(-120%, -70%) rotateZ(-15deg) scale(1.1);
}

.folder.open .paper:nth-child(2) {
transform: translate(10%, -70%) rotateZ(15deg);
height: 80%;
}

.folder.open .paper:nth-child(2):hover {
transform: translate(10%, -70%) rotateZ(15deg) scale(1.1);
}

.folder.open .paper:nth-child(3) {
transform: translate(-50%, -100%) rotateZ(5deg);
height: 80%;
}

.folder.open .paper:nth-child(3):hover {
transform: translate(-50%, -100%) rotateZ(5deg) scale(1.1);
}

.folder.open .folder__front {
transform: skew(15deg) scaleY(0.6);
}

.folder.open .right {
transform: skew(-15deg) scaleY(0.6);
}

.folder__back {
position: relative;
width: 100px;
height: 80px;
background: var(--folder-back-color);
border-radius: 0px 10px 10px 10px;
}

.folder__back::after {
position: absolute;
z-index: 0;
bottom: 98%;
left: 0;
content: "";
width: 30px;
height: 10px;
background: var(--folder-back-color);
border-radius: 5px 5px 0 0;
}

.paper {
position: absolute;
z-index: 2;
bottom: 10%;
left: 50%;
transform: translate(-50%, 10%);
width: 70%;
height: 80%;
background: var(--paper-1);
border-radius: 10px;
transition: all 0.3s ease-in-out;
}

.paper:nth-child(2) {
background: var(--paper-2);
width: 80%;
height: 70%;
}

.paper:nth-child(3) {
background: var(--paper-3);
width: 90%;
height: 60%;
}

.folder__front {
position: absolute;
z-index: 3;
width: 100%;
height: 100%;
background: var(--folder-color);
border-radius: 5px 10px 10px 10px;
transform-origin: bottom;
transition: all 0.3s ease-in-out;
}
