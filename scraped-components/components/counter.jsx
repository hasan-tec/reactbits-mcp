/**
 * Counter
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
// USAGE EXAMPLE
// ============================================================================

<Counter
value={1}
places={[100, 10, 1]}
fontSize={80}
padding={5}
gap={10}
textColor="white"
fontWeight={900}
/>


<motion.span className="counter-number" style={{ y }}>
{number}
</motion.span>
);
}


<div className="counter-digit" style={{ height, ...digitStyle }}>
{Array.from({ length: 10 }, (_, i) => (
<Number key={i} mv={animatedValue} number={i} height={height} />
))}
</div>
);
}


<div className="counter-container" style={containerStyle}>
<div
className="counter-counter"
style={{ ...defaultCounterStyle, ...counterStyle }}
>
{places.map((place) => (
<Digit
key={place}
place={place}
value={value}
height={height}
digitStyle={digitStyle}
/>
))}
</div>
<div className="gradient-container">
<div
className="top-gradient"
style={topGradientStyle ? topGradientStyle : defaultTopGradientStyle}
></div>
<div
className="bottom-gradient"
style={
bottomGradientStyle
? bottomGradientStyle
: defaultBottomGradientStyle
}
></div>
</div>
</div>
);
}


.counter-container {
position: relative;
display: inline-block;
}

.counter-counter {
display: flex;
overflow: hidden;
line-height: 1;
}

.counter-digit {
position: relative;
width: 1ch;
font-variant-numeric: tabular-nums;
}

.counter-number {
position: absolute;
top: 0;
right: 0;
bottom: 0;
left: 0;
display: flex;
align-items: center;
justify-content: center;
}

.gradient-container {
pointer-events: none;
position: absolute;
top: 0;
bottom: 0;
left: 0;
right: 0;
}

.bottom-gradient {
position: absolute;
bottom: 0;
width: 100%;
}


<div style={{ ...defaultStyle, ...digitStyle }}>
{Array.from({ length: 10 }, (_, i) => (
<Number key={i} mv={animatedValue} number={i} height={height} />
))}
</div>
);
}


<div style={{ ...defaultContainerStyle, ...containerStyle }}>
<div style={{ ...defaultCounterStyle, ...counterStyle }}>
{places.map((place) => (
<Digit
key={place}
place={place}
value={value}
height={height}
digitStyle={digitStyle}
/>
))}
</div>
<div style={gradientContainerStyle}>
<div
style={topGradientStyle ? topGradientStyle : defaultTopGradientStyle}
/>
<div
style={
bottomGradientStyle
? bottomGradientStyle
: defaultBottomGradientStyle
}
/>
</div>
</div>
);
}


// ============================================================================
// IMPLEMENTATION
// ============================================================================

npm i framer-motion
import Counter from './Counter';

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import "./Counter.css";

let offset = (10 + number - placeValue) % 10;
let memo = offset * height;
if (offset > 5) {
memo -= 10 * height;
}
return memo;
});
return (

function Digit({ place, value, height, digitStyle }) {
let valueRoundedToPlace = Math.floor(value / place);
let animatedValue = useSpring(valueRoundedToPlace);
useEffect(() => {
animatedValue.set(valueRoundedToPlace);
}, [animatedValue, valueRoundedToPlace]);
return (

const defaultBottomGradientStyle = {
height: gradientHeight,
background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
};
return (

const defaultStyle = {
height,
position: "relative",
width: "1ch",
fontVariantNumeric: "tabular-nums",
};

return (

const defaultBottomGradientStyle = {
position: "absolute",
bottom: 0,
width: "100%",
height: gradientHeight,
background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
};

return (