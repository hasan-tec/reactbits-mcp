/**
 * Dither
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

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
<Dither
waveColor={[0.5, 0.5, 0.5]}
disableAnimation={false}
enableMouseInteraction={true}
mouseRadius={0.3}
colorNum={4}
waveAmplitude={0.3}
waveFrequency={3}
waveSpeed={0.05}
/>
</div>

/* eslint-disable react/no-unknown-property */

<>
<mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
<planeGeometry args={[1, 1]} />
<shaderMaterial
vertexShader={waveVertexShader}
fragmentShader={waveFragmentShader}
uniforms={waveUniformsRef.current}
/>
</mesh>
<EffectComposer>
<RetroEffect ref={effect} />
</EffectComposer>
<mesh
onPointerMove={handlePointerMove}
position={[0, 0, 0.01]}
scale={[viewport.width, viewport.height, 1]}
visible={false}
>
<planeGeometry args={[1, 1]} />
<meshBasicMaterial transparent opacity={0} />
</mesh>
</>
);
}


<Canvas
className="dither-container"
camera={{ position: [0, 0, 6] }}
dpr={window.devicePixelRatio}
gl={{ antialias: true, preserveDrawingBuffer: true }}
>
<DitheredWaves
waveSpeed={waveSpeed}
waveFrequency={waveFrequency}
waveAmplitude={waveAmplitude}
waveColor={waveColor}
colorNum={colorNum}
pixelSize={pixelSize}
disableAnimation={disableAnimation}
enableMouseInteraction={enableMouseInteraction}
mouseRadius={mouseRadius}
/>
</Canvas>
);
}


.dither-container {
width: 100%;
height: 100%;
position: relative;
}

/* eslint-disable react/no-unknown-property */

<>
<mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
<planeGeometry args={[1, 1]} />
<shaderMaterial
vertexShader={waveVertexShader}
fragmentShader={waveFragmentShader}
uniforms={waveUniformsRef.current}
/>
</mesh>
<EffectComposer>
<RetroEffect ref={effect} />
</EffectComposer>
<mesh
onPointerMove={handlePointerMove}
position={[0, 0, 0.01]}
scale={[viewport.width, viewport.height, 1]}
visible={false}
>
<planeGeometry args={[1, 1]} />
<meshBasicMaterial transparent opacity={0} />
</mesh>
</>
);
}


<Canvas
className="w-full h-full relative"
camera={{ position: [0, 0, 6] }}
dpr={window.devicePixelRatio}
gl={{ antialias: true, preserveDrawingBuffer: true }}
>
<DitheredWaves
waveSpeed={waveSpeed}
waveFrequency={waveFrequency}
waveAmplitude={waveAmplitude}
waveColor={waveColor}
colorNum={colorNum}
pixelSize={pixelSize}
disableAnimation={disableAnimation}
enableMouseInteraction={enableMouseInteraction}
mouseRadius={mouseRadius}
/>
</Canvas>
);
}


// ============================================================================
// IMPLEMENTATION
// ============================================================================

npm i three postprocessing @react-three/fiber @react-three/postprocessing
import Dither from './Dither';

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, wrapEffect } from "@react-three/postprocessing";
import { Effect } from "postprocessing";
import * as THREE from "three";
import './Dither.css';

const y = (e.clientY - rect.top) * dpr;
setMousePos({ x, y });
};

return (

export default function Dither({
waveSpeed = 0.05,
waveFrequency = 3,
waveAmplitude = 0.3,
waveColor = [0.5, 0.5, 0.5],
colorNum = 4,
pixelSize = 2,
disableAnimation = false,
enableMouseInteraction = true,
mouseRadius = 1
}) {
return (

const y = (e.clientY - rect.top) * dpr;
setMousePos({ x, y });
};

return (

export default function Dither({
waveSpeed = 0.05,
waveFrequency = 3,
waveAmplitude = 0.3,
waveColor = [0.5, 0.5, 0.5],
colorNum = 4,
pixelSize = 2,
disableAnimation = false,
enableMouseInteraction = true,
mouseRadius = 1
}) {
return (