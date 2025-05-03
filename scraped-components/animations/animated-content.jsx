/**
 * Animated Content
 * 
 * An open source collection of high quality, animated, interactive & fully customizable React components for building stunning, memorable user interfaces.
 */



// ============================================================================
// IMPLEMENTATION
// ============================================================================

npm install @react-spring/web

import AnimatedContent from './AnimatedContent'

<AnimatedContent
distance={150}
direction="horizontal"
reverse={false}
config={{ tension: 80, friction: 20 }}
initialOpacity={0.2}
animateOpacity
scale={1.1}
threshold={0.2}
>
<div>Content to Animate</div>
</AnimatedContent>

import { useRef, useEffect, useState } from "react";

import { useSpring, animated } from "@react-spring/web";

const AnimatedContent = ({
children,
distance = 100,
direction = "vertical",
reverse = false,
config = { tension: 50, friction: 25 },
initialOpacity = 0,
animateOpacity = true,
scale = 1,
threshold = 0.1,
delay = 0
}) => {
const [inView, setInView] = useState(false);
const ref = useRef();

useEffect(() => {
if (!ref.current) return;

const observer = new IntersectionObserver(
([entry]) => {
if (entry.isIntersecting) {
observer.unobserve(ref.current);
setTimeout(() => {
setInView(true);
}, delay);
}
},
{ threshold }
);

observer.observe(ref.current);

return () => observer.disconnect();
}, [threshold, delay]);

const directions = {
vertical: "Y",
horizontal: "X",
};

const springProps = useSpring({
from: {
transform: `translate${directions[direction]}(${reverse ? `-${distance}px` : `${distance}px`}) scale(${scale})`,
opacity: animateOpacity ? initialOpacity : 1,
},
to: inView
? {
transform: `translate${directions[direction]}(0px) scale(1)`,
opacity: 1,
}
: undefined,
config,
});

return (
<animated.div ref={ref} style={springProps}>
{children}
</animated.div>
);
};

export default AnimatedContent;



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