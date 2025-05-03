/**
 * Magnet
 * 
 * An open source collection of high quality, animated, interactive & fully customizable React components for building stunning, memorable user interfaces.
 */

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

<Magnet padding={50} disabled={false} magnetStrength={50}>
<p>Star React Bits on GitHub!</p>
</Magnet>


<div
ref={magnetRef}
className={wrapperClassName}
style={{ position: "relative", display: "inline-block" }}
{...props}
>
<div
className={innerClassName}
style={{
transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
transition: transitionStyle,
willChange: "transform",
}}
>
{children}
</div>
</div>
);
};


// ============================================================================
// IMPLEMENTATION
// ============================================================================

import Magnet from './Magnet'

import { useState, useEffect, useRef } from "react";

const transitionStyle = isActive ? activeTransition : inactiveTransition;

return (

export default Magnet;


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