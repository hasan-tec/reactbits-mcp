/**
 * Stepper
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

<Stepper
initialStep={1}
onStepChange={(step) => {
console.log(step);
}}
onFinalStepCompleted={() => console.log("All steps completed!")}
backButtonText="Previous"
nextButtonText="Next"
>
<Step>
<h2>Welcome to the React Bits stepper!</h2>
<p>Check out the next step!</p>
</Step>
<Step>
<h2>Step 2</h2>
<img style={{ height: '100px', width: '100%', objectFit: 'cover', objectPosition: 'center -70px', borderRadius: '15px', marginTop: '1em' }} src="https://www.purrfectcatgifts.co.uk/cdn/shop/collections/Funny_Cat_Cards_640x640.png?v=1663150894" />
<p>Custom step content!</p>
</Step>
<Step>
<h2>How about an input?</h2>
<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name?" />
</Step>
<Step>
<h2>Final Step</h2>
<p>You made it!</p>
</Step>
</Stepper>


<div className="outer-container" {...rest}>
<div className={`step-circle-container ${stepCircleContainerClassName}`} style={{ border: "1px solid #222" }}>
<div className={`step-indicator-row ${stepContainerClassName}`}>
{stepsArray.map((_, index) => {

<React.Fragment key={stepNumber}>
{renderStepIndicator ? (
renderStepIndicator({
step: stepNumber,
currentStep,
onStepClick: (clicked) => {
setDirection(clicked > currentStep ? 1 : -1);
updateStep(clicked);
},
})
) : (
<StepIndicator
step={stepNumber}
disableStepIndicators={disableStepIndicators}
currentStep={currentStep}
onClickStep={(clicked) => {
setDirection(clicked > currentStep ? 1 : -1);
updateStep(clicked);
}}
/>
)}
{isNotLastStep && (
<StepConnector isComplete={currentStep > stepNumber} />
)}
</React.Fragment>
);
})}
</div>

<StepContentWrapper
isCompleted={isCompleted}
currentStep={currentStep}
direction={direction}
className={`step-content-default ${contentClassName}`}
>
{stepsArray[currentStep - 1]}
</StepContentWrapper>

{!isCompleted && (
<div className={`footer-container ${footerClassName}`}>
<div className={`footer-nav ${currentStep !== 1 ? "spread" : "end"}`}>
{currentStep !== 1 && (
<button
onClick={handleBack}
className={`back-button ${currentStep === 1 ? "inactive" : ""}`}
{...backButtonProps}
>
{backButtonText}
</button>
)}
<button
onClick={isLastStep ? handleComplete : handleNext}
className="next-button"
{...nextButtonProps}
>
{isLastStep ? "Complete" : nextButtonText}
</button>
</div>
</div>
)}
</div>
</div>
);
}


<motion.div
className={className}
style={{ position: "relative", overflow: "hidden" }}
animate={{ height: isCompleted ? 0 : parentHeight }}
transition={{ type: "spring", duration: 0.4 }}
>
<AnimatePresence initial={false} mode="sync" custom={direction}>
{!isCompleted && (
<SlideTransition key={currentStep} direction={direction} onHeightReady={(h) => setParentHeight(h)}>
{children}
</SlideTransition>
)}
</AnimatePresence>
</motion.div>
);
}


<motion.div
ref={containerRef}
custom={direction}
variants={stepVariants}
initial="enter"
animate="center"
exit="exit"
transition={{ duration: 0.4 }}
style={{ position: "absolute", left: 0, right: 0, top: 0 }}
>
{children}
</motion.div>
);
}


<motion.div onClick={handleClick} className="step-indicator" animate={status} initial={false}>
<motion.div
variants={{
inactive: { scale: 1, backgroundColor: "#222", color: "#a3a3a3" },
active: { scale: 1, backgroundColor: "#00d8ff", color: "#00d8ff" },
complete: { scale: 1, backgroundColor: "#00d8ff", color: "#3b82f6" },
}}
transition={{ duration: 0.3 }}
className="step-indicator-inner"
>
{status === "complete" ? (
<CheckIcon className="check-icon" />
) : status === "active" ? (
<div className="active-dot" />
) : (
<span className="step-number">{step}</span>
)}
</motion.div>
</motion.div>
);
}


<div className="step-connector">
<motion.div
className="step-connector-inner"
variants={lineVariants}
initial={false}
animate={isComplete ? "complete" : "incomplete"}
transition={{ duration: 0.4 }}
/>
</div>
);
}


<svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
<motion.path
initial={{ pathLength: 0 }}
animate={{ pathLength: 1 }}
transition={{ delay: 0.1, type: "tween", ease: "easeOut", duration: 0.3 }}
strokeLinecap="round"
strokeLinejoin="round"
d="M5 13l4 4L19 7"
/>
</svg>
);
}


.outer-container {
display: flex;
min-height: 100%;
flex: 1 1 0%;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 1rem;
}

@media (min-width: 640px) {
.outer-container {
aspect-ratio: 4 / 3;
}
}

@media (min-width: 768px) {
.outer-container {
aspect-ratio: 2 / 1;
}
}

.step-circle-container {
margin-left: auto;
margin-right: auto;
width: 100%;
max-width: 28rem;
border-radius: 2rem;
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.step-indicator-row {
display: flex;
width: 100%;
align-items: center;
padding: 2rem;
}

.step-content-default {
position: relative;
overflow: hidden;
}

.step-default {
padding-left: 2rem;
padding-right: 2rem;
}

.footer-container {
padding-left: 2rem;
padding-right: 2rem;
padding-bottom: 2rem;
}

.footer-nav {
margin-top: 2.5rem;
display: flex;
}

.footer-nav.spread {
justify-content: space-between;
}

.footer-nav.end {
justify-content: flex-end;
}

.back-button {
transition: all 350ms;
border-radius: 0.25rem;
padding: 0.25rem 0.5rem;
color: #a3a3a3;
cursor: pointer;
}

.back-button:hover {
color: #52525b;
}

.back-button.inactive {
pointer-events: none;
opacity: 0.5;
color: #a3a3a3;
}

.next-button {
transition: all 350ms;
display: flex;
align-items: center;
justify-content: center;
border-radius: 9999px;
background-color: #00d8ff;
color: #060606;
font-weight: 500;
letter-spacing: -0.025em;
padding: 0.375rem 0.875rem;
cursor: pointer;
}

.next-button:hover {
background-color: #00d8ff;
}

.next-button:active {
background-color: #00d8ff;
}

.step-indicator {
position: relative;
cursor: pointer;
outline: none;
}

.step-indicator-inner {
display: flex;
height: 2rem;
width: 2rem;
align-items: center;
justify-content: center;
border-radius: 9999px;
font-weight: 600;
}

.active-dot {
height: 0.75rem;
width: 0.75rem;
border-radius: 9999px;
background-color: #060606;
}

.step-number {
font-size: 0.875rem;
}

.step-connector {
position: relative;
margin-left: 0.5rem;
margin-right: 0.5rem;
height: 0.125rem;
flex: 1;
overflow: hidden;
border-radius: 0.25rem;
background-color: #52525b;
}

.step-connector-inner {
position: absolute;
left: 0;
top: 0;
height: 100%;
}

.check-icon {
height: 1rem;
width: 1rem;
color: #000;
}


<div
className="flex min-h-full flex-1 flex-col items-center justify-center p-4 sm:aspect-[4/3] md:aspect-[2/1]"
{...rest}
>
<div
className={`mx-auto w-full max-w-md rounded-4xl shadow-xl ${stepCircleContainerClassName}`}
style={{ border: "1px solid #222" }}
>
<div className={`${stepContainerClassName} flex w-full items-center p-8`}>
{stepsArray.map((_, index) => {

<React.Fragment key={stepNumber}>
{renderStepIndicator ? (
renderStepIndicator({
step: stepNumber,
currentStep,
onStepClick: (clicked) => {
setDirection(clicked > currentStep ? 1 : -1);
updateStep(clicked);
},
})
) : (
<StepIndicator
step={stepNumber}
disableStepIndicators={disableStepIndicators}
currentStep={currentStep}
onClickStep={(clicked) => {
setDirection(clicked > currentStep ? 1 : -1);
updateStep(clicked);
}}
/>
)}
{isNotLastStep && (
<StepConnector isComplete={currentStep > stepNumber} />
)}
</React.Fragment>
);
})}
</div>
<StepContentWrapper
isCompleted={isCompleted}
currentStep={currentStep}
direction={direction}
className={`space-y-2 px-8 ${contentClassName}`}
>
{stepsArray[currentStep - 1]}
</StepContentWrapper>
{!isCompleted && (
<div className={`px-8 pb-8 ${footerClassName}`}>
<div
className={`mt-10 flex ${currentStep !== 1 ? "justify-between" : "justify-end"
}`}
>
{currentStep !== 1 && (
<button
onClick={handleBack}
className={`duration-350 rounded px-2 py-1 transition ${currentStep === 1
? "pointer-events-none opacity-50 text-neutral-400"
: "text-neutral-400 hover:text-neutral-700"
}`}
{...backButtonProps}
>
{backButtonText}
</button>
)}
<button
onClick={isLastStep ? handleComplete : handleNext}
className="duration-350 flex items-center justify-center rounded-full bg-green-500 py-1.5 px-3.5 font-medium tracking-tight text-white transition hover:bg-green-600 active:bg-green-700"
{...nextButtonProps}
>
{isLastStep ? "Complete" : nextButtonText}
</button>
</div>
</div>
)}
</div>
</div>
);
}


<motion.div
style={{ position: "relative", overflow: "hidden" }}
animate={{ height: isCompleted ? 0 : parentHeight }}
transition={{ type: "spring", duration: 0.4 }}
className={className}
>
<AnimatePresence initial={false} mode="sync" custom={direction}>
{!isCompleted && (
<SlideTransition
key={currentStep}
direction={direction}
onHeightReady={(h) => setParentHeight(h)}
>
{children}
</SlideTransition>
)}
</AnimatePresence>
</motion.div>
);
}


<motion.div
ref={containerRef}
custom={direction}
variants={stepVariants}
initial="enter"
animate="center"
exit="exit"
transition={{ duration: 0.4 }}
style={{ position: "absolute", left: 0, right: 0, top: 0 }}
>
{children}
</motion.div>
);
}


<motion.div
onClick={handleClick}
className="relative cursor-pointer outline-none focus:outline-none"
animate={status}
initial={false}
>
<motion.div
variants={{
inactive: { scale: 1, backgroundColor: "#222", color: "#a3a3a3" },
active: { scale: 1, backgroundColor: "#00d8ff", color: "#00d8ff" },
complete: { scale: 1, backgroundColor: "#00d8ff", color: "#3b82f6" },
}}
transition={{ duration: 0.3 }}
className="flex h-8 w-8 items-center justify-center rounded-full font-semibold"
>
{status === "complete" ? (
<CheckIcon className="h-4 w-4 text-black" />
) : status === "active" ? (
<div className="h-3 w-3 rounded-full bg-[#060606]" />
) : (
<span className="text-sm">{step}</span>
)}
</motion.div>
</motion.div>
);
}


<div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded bg-neutral-600">
<motion.div
className="absolute left-0 top-0 h-full"
variants={lineVariants}
initial={false}
animate={isComplete ? "complete" : "incomplete"}
transition={{ duration: 0.4 }}
/>
</div>
);
}


<svg
{...props}
fill="none"
stroke="currentColor"
strokeWidth={2}
viewBox="0 0 24 24"
>
<motion.path
initial={{ pathLength: 0 }}
animate={{ pathLength: 1 }}
transition={{ delay: 0.1, type: "tween", ease: "easeOut", duration: 0.3 }}
strokeLinecap="round"
strokeLinejoin="round"
d="M5 13l4 4L19 7"
/>
</svg>
);
}


// ============================================================================
// IMPLEMENTATION
// ============================================================================

npm i framer-motion
import Stepper, { Step } from './Stepper';

import React, { useState, Children, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Stepper.css";

const handleComplete = () => {
setDirection(1);
updateStep(totalSteps + 1);
};

return (

const isNotLastStep = index < totalSteps - 1;
return (

const [parentHeight, setParentHeight] = useState(0);

return (

const containerRef = useRef(null);

useLayoutEffect(() => {
if (containerRef.current) onHeightReady(containerRef.current.offsetHeight);
}, [children, onHeightReady]);

return (

const handleClick = () => {
if (step !== currentStep && !disableStepIndicators) onClickStep(step);
};

return (

const lineVariants = {
incomplete: { width: 0, backgroundColor: "transparent" },
complete: { width: "100%", backgroundColor: "#00d8ff" },
};

return (

function CheckIcon(props) {
return (

const handleComplete = () => {
setDirection(1);
updateStep(totalSteps + 1);
};

return (

const isNotLastStep = index < totalSteps - 1;
return (

const [parentHeight, setParentHeight] = useState(0);

return (

const containerRef = useRef(null);

useLayoutEffect(() => {
if (containerRef.current) onHeightReady(containerRef.current.offsetHeight);
}, [children, onHeightReady]);

return (

const handleClick = () => {
if (step !== currentStep && !disableStepIndicators) onClickStep(step);
};

return (

const lineVariants = {
incomplete: { width: 0, backgroundColor: "transparent" },
complete: { width: "100%", backgroundColor: "#00d8ff" },
};

return (

function CheckIcon(props) {
return (