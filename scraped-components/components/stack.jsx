/**
 * Stack
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

import Stack from './Stack'

const images = [
{ id: 1, img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format" },
{ id: 2, img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format" },
{ id: 3, img: "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format" },
{ id: 4, img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format" }
];

<Stack
randomRotation={true}
sensitivity={180}
sendToBackOnClick={false}
cardDimensions={{ width: 200, height: 200 }}
cardsData={images}
/>

import { motion, useMotionValue, useTransform } from "framer-motion";

import { useState } from "react";

function CardRotate({ children, onSendToBack, sensitivity }) {
const x = useMotionValue(0);
const y = useMotionValue(0);
const rotateX = useTransform(y, [-100, 100], [60, -60]);
const rotateY = useTransform(x, [-100, 100], [-60, 60]);

function handleDragEnd(_, info) {
if (
Math.abs(info.offset.x) > sensitivity ||
Math.abs(info.offset.y) > sensitivity
) {
onSendToBack();
} else {
x.set(0);
y.set(0);
}
}

return (
<motion.div
className="absolute cursor-grab"
style={{ x, y, rotateX, rotateY }}
drag
dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
dragElastic={0.6}
whileTap={{ cursor: "grabbing" }}
onDragEnd={handleDragEnd}
>
{children}
</motion.div>
);
}

export default function Stack({
randomRotation = false,
sensitivity = 200,
cardDimensions = { width: 208, height: 208 },
cardsData = [],
animationConfig = { stiffness: 260, damping: 20 },
sendToBackOnClick = false
}) {
const [cards, setCards] = useState(
cardsData.length
? cardsData
: [
{ id: 1, img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format" },
{ id: 2, img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format" },
{ id: 3, img: "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format" },
{ id: 4, img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format" }
]
);

const sendToBack = (id) => {
setCards((prev) => {
const newCards = [...prev];
const index = newCards.findIndex((card) => card.id === id);
const [card] = newCards.splice(index, 1);
newCards.unshift(card);
return newCards;
});
};

return (
<div
className="relative"
style={{
width: cardDimensions.width,
height: cardDimensions.height,
perspective: 600,
}}
>
{cards.map((card, index) => {
const randomRotate = randomRotation
? Math.random() * 10 - 5 // Random degree between -5 and 5
: 0;

return (
<CardRotate
key={card.id}
onSendToBack={() => sendToBack(card.id)}
sensitivity={sensitivity}
>
<motion.div
className="rounded-2xl overflow-hidden border-4 border-white"
onClick={() => sendToBackOnClick && sendToBack(card.id)}
animate={{
rotateZ: (cards.length - index - 1) * 4 + randomRotate,
scale: 1 + index * 0.06 - cards.length * 0.06,
transformOrigin: "90% 90%",
}}
initial={false}
transition={{
type: "spring",
stiffness: animationConfig.stiffness,
damping: animationConfig.damping,
}}
style={{
width: cardDimensions.width,
height: cardDimensions.height,
}}
>
<img
src={card.img}
alt={`card-${card.id}`}
className="w-full h-full object-cover pointer-events-none"
/>
</motion.div>
</CardRotate>
);
})}
</div>
);
}

import "./Stack.css";

function CardRotate({ children, onSendToBack, sensitivity }) {
const x = useMotionValue(0);
const y = useMotionValue(0);
const rotateX = useTransform(y, [-100, 100], [60, -60]);
const rotateY = useTransform(x, [-100, 100], [-60, 60]);

function handleDragEnd(_, info) {
if (
Math.abs(info.offset.x) > sensitivity ||
Math.abs(info.offset.y) > sensitivity
) {
onSendToBack();
} else {
x.set(0);
y.set(0);
}
}

return (
<motion.div
className="card-rotate"
style={{ x, y, rotateX, rotateY }}
drag
dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
dragElastic={0.6}
whileTap={{ cursor: "grabbing" }}
onDragEnd={handleDragEnd}
>
{children}
</motion.div>
);
}

export default function Stack({
randomRotation = false,
sensitivity = 200,
cardDimensions = { width: 208, height: 208 },
cardsData = [],
animationConfig = { stiffness: 260, damping: 20 },
sendToBackOnClick = false
}) {
const [cards, setCards] = useState(
cardsData.length
? cardsData
: [
{ id: 1, img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format" },
{ id: 2, img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format" },
{ id: 3, img: "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format" },
{ id: 4, img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format" }
]
);

const sendToBack = (id) => {
setCards((prev) => {
const newCards = [...prev];
const index = newCards.findIndex((card) => card.id === id);
const [card] = newCards.splice(index, 1);
newCards.unshift(card);
return newCards;
});
};

return (
<div
className="stack-container"
style={{
width: cardDimensions.width,
height: cardDimensions.height,
perspective: 600,
}}
>
{cards.map((card, index) => {
const randomRotate = randomRotation
? Math.random() * 10 - 5 // Random degree between -5 and 5
: 0;

return (
<CardRotate
key={card.id}
onSendToBack={() => sendToBack(card.id)}
sensitivity={sensitivity}
>
<motion.div
className="card"
onClick={() => sendToBackOnClick && sendToBack(card.id)}
animate={{
rotateZ: (cards.length - index - 1) * 4 + randomRotate,
scale: 1 + index * 0.06 - cards.length * 0.06,
transformOrigin: "90% 90%",
}}
initial={false}
transition={{
type: "spring",
stiffness: animationConfig.stiffness,
damping: animationConfig.damping,
}}
style={{
width: cardDimensions.width,
height: cardDimensions.height,
}}
>
<img
src={card.img}
alt={`card-${card.id}`}
className="card-image"
/>
</motion.div>
</CardRotate>
);
})}
</div>
);
}


.stack-container {
position: relative;
perspective: 600px;
}

.card-rotate {
position: absolute;
cursor: grab;
}

.card {
border-radius: 20px;
border: 5px solid #fff;
overflow: hidden;
}

.card-image {
pointer-events: none;
width: 100%;
height: 100%;
object-fit: cover;
}
