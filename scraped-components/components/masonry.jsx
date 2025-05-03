/**
 * Masonry
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

npm i @react-spring/web

import Masonry from './Masonry'

const data = [
{ id: 1, image: 'https://picsum.photos/id/10/200/300', height: 400 },
{ id: 2, image: 'https://picsum.photos/id/14/200/300', height: 300 },
{ id: 3, image: 'https://picsum.photos/id/15/200/300', height: 300 },
{ id: 4, image: 'https://picsum.photos/id/16/200/300', height: 300 },
{ id: 5, image: 'https://picsum.photos/id/17/200/300', height: 300 },
{ id: 6, image: 'https://picsum.photos/id/19/200/300', height: 300 },
{ id: 7, image: 'https://picsum.photos/id/37/200/300', height: 200 },
{ id: 8, image: 'https://picsum.photos/id/39/200/300', height: 300 },
{ id: 9, image: 'https://picsum.photos/id/85/200/300', height: 200 },
{ id: 10, image: 'https://picsum.photos/id/103/200/300', height: 400 }
];

<Masonry data={data} />

import { useState, useEffect, useMemo, useRef } from 'react';

import { useTransition, a } from '@react-spring/web';

function Masonry({ data }) {
const [columns, setColumns] = useState(2);

useEffect(() => {
const updateColumns = () => {
if (window.matchMedia('(min-width: 1500px)').matches) {
setColumns(5);
} else if (window.matchMedia('(min-width: 1000px)').matches) {
setColumns(4);
} else if (window.matchMedia('(min-width: 600px)').matches) {
setColumns(3);
} else {
setColumns(1); // Mobile devices
}
};

updateColumns();
window.addEventListener('resize', updateColumns);
return () => window.removeEventListener('resize', updateColumns);
}, []);

const ref = useRef();
const [width, setWidth] = useState(0);

useEffect(() => {
const handleResize = () => {
if (ref.current) {
setWidth(ref.current.offsetWidth);
}
};

handleResize();
window.addEventListener('resize', handleResize);
return () => window.removeEventListener('resize', handleResize);
}, []);

const [heights, gridItems] = useMemo(() => {
let heights = new Array(columns).fill(0);
let gridItems = data.map((child) => {
const column = heights.indexOf(Math.min(...heights));
const x = (width / columns) * column;
const y = (heights[column] += child.height / 2) - child.height / 2;
return { ...child, x, y, width: width / columns, height: child.height / 2 };
});
return [heights, gridItems];
}, [columns, data, width]);

const transitions = useTransition(gridItems, {
keys: (item) => item.id,
from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
update: ({ x, y, width, height }) => ({ x, y, width, height }),
leave: { height: 0, opacity: 0 },
config: { mass: 5, tension: 500, friction: 100 },
trail: 25,
});

return (
<div
ref={ref}
className="relative w-full h-full"
style={{ height: Math.max(...heights) }}
>
{transitions((style, item) => (
<a.div
key={item.id}
style={style}
className="absolute p-[15px] [will-change:transform,width,height,opacity]"
>
<div
className="relative w-full h-full overflow-hidden uppercase text-[10px] leading-[10px] rounded-[4px] shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)] transition duration-300 ease hover:scale-110"
style={{
backgroundColor: '#ffffff',
backgroundImage: `url(${item.image})`,
backgroundSize: 'cover',
backgroundPosition: 'center',
}}
/>
</a.div>
))}
</div>
);
}

export default Masonry;

import './Masonry.css';

function Masonry({ data }) {
const [columns, setColumns] = useState(2);

useEffect(() => {
const updateColumns = () => {
if (window.matchMedia('(min-width: 1500px)').matches) {
setColumns(5);
} else if (window.matchMedia('(min-width: 1000px)').matches) {
setColumns(4);
} else if (window.matchMedia('(min-width: 600px)').matches) {
setColumns(3);
} else {
setColumns(1); // Breakpoint for mobile devices
}
};

updateColumns();
window.addEventListener('resize', updateColumns);
return () => window.removeEventListener('resize', updateColumns);
}, []);

const ref = useRef();
const [width, setWidth] = useState(0);

useEffect(() => {
const handleResize = () => {
if (ref.current) {
setWidth(ref.current.offsetWidth);
}
};

handleResize(); // Set initial width
window.addEventListener('resize', handleResize);
return () => window.removeEventListener('resize', handleResize);
}, [ref]);

const [heights, gridItems] = useMemo(() => {
let heights = new Array(columns).fill(0);
let gridItems = data.map((child) => {
const column = heights.indexOf(Math.min(...heights));
const x = (width / columns) * column;
const y = (heights[column] += child.height / 2) - child.height / 2;
return { ...child, x, y, width: width / columns, height: child.height / 2 };
});
return [heights, gridItems];
}, [columns, data, width]);

const transitions = useTransition(gridItems, {
keys: (item) => item.id, // Use a unique key based on the id
from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
update: ({ x, y, width, height }) => ({ x, y, width, height }),
leave: { height: 0, opacity: 0 },
config: { mass: 5, tension: 500, friction: 100 },
trail: 25,
});

// Render the grid
return (
<div ref={ref} className='masonry' style={{ height: Math.max(...heights) }}>
{transitions((style, item) => (
<a.div key={item.id} style={style}>
<div
style={{
backgroundColor: '#ffffff', // Set background if needed
width: '100%',
height: '100%',
backgroundImage: `url(${item.image})`,
backgroundSize: 'cover',
backgroundPosition: 'center',
}}
/>
</a.div>
))}
</div>
);
}

export default Masonry;


.masonry {
position: relative;
width: 100%;
height: 100%;
}

.masonry>div {
position: absolute;
will-change: transform, width, height, opacity;
padding: 10px;
}

.masonry>div>div {
position: relative;
background-size: cover;
background-position: center center;
width: 100%;
height: 100%;
overflow: hidden;
text-transform: uppercase;
font-size: 10px;
line-height: 10px;
border-radius: 10px;
box-shadow: 0px 10px 50px -10px rgba(0, 0, 0, 0.2);
transition: 0.3s ease;
}

.masonry>div>div:hover {
transform: scale(1.1);
transition: 0.3s ease;
}
