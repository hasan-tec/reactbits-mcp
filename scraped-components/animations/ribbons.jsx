/**
 * Ribbons
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

<div style={{ height: '500px', position: 'relative', overflow: 'hidden'}}>
<Ribbons
baseThickness={30}
colors={['#ffffff']}
speedMultiplier={0.5}
maxAge={500}
enableFade={false}
enableShaderEffect={true}
/>
</div>


<div
ref={containerRef}
className="ribbons-container"
/>
);
};


<div
ref={containerRef}
className='relative w-full h-full'
/>
);
};


// ============================================================================
// IMPLEMENTATION
// ============================================================================

npm i ogl
import Ribbons from './Ribbons';

import { useEffect, useRef } from 'react';
import { Renderer, Transform, Vec3, Color, Polyline } from 'ogl';
import './Ribbons.css';

const alpha = Math.min(1, (dt * speedMultiplier) / segmentDelay);
line.points[i].lerp(line.points[i - 1], alpha);
} else {
line.points[i].lerp(line.points[i - 1], 0.9);
}
}
if (line.polyline.mesh.program.uniforms.uTime) {
line.polyline.mesh.program.uniforms.uTime.value = currentTime * 0.001;
}
line.polyline.updateGeometry();
});

renderer.render({ scene });
}
update();

return () => {
window.removeEventListener('resize', resize);
container.removeEventListener('mousemove', updateMouse);
container.removeEventListener('touchstart', updateMouse);
container.removeEventListener('touchmove', updateMouse);
cancelAnimationFrame(frameId);
if (gl.canvas && gl.canvas.parentNode === container) {
container.removeChild(gl.canvas);
}
};
}, [
colors,
baseSpring,
baseFriction,
baseThickness,
offsetFactor,
maxAge,
pointCount,
speedMultiplier,
enableFade,
enableShaderEffect,
effectAmplitude,
backgroundColor
]);

return (

export default Ribbons;


.ribbons-container {
width: 100%;
height: 100%;
position: relative;
}


const alpha = Math.min(1, (dt * speedMultiplier) / segmentDelay);
line.points[i].lerp(line.points[i - 1], alpha);
} else {
line.points[i].lerp(line.points[i - 1], 0.9);
}
}
if (line.polyline.mesh.program.uniforms.uTime) {
line.polyline.mesh.program.uniforms.uTime.value = currentTime * 0.001;
}
line.polyline.updateGeometry();
});

renderer.render({ scene });
}
update();

return () => {
window.removeEventListener('resize', resize);
container.removeEventListener('mousemove', updateMouse);
container.removeEventListener('touchstart', updateMouse);
container.removeEventListener('touchmove', updateMouse);
cancelAnimationFrame(frameId);
if (gl.canvas && gl.canvas.parentNode === container) {
container.removeChild(gl.canvas);
}
};
}, [
colors,
baseSpring,
baseFriction,
baseThickness,
offsetFactor,
maxAge,
pointCount,
speedMultiplier,
enableFade,
enableShaderEffect,
effectAmplitude,
backgroundColor
]);

return (

export default Ribbons;
