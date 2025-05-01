// components/MorphingBlob.js
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import flubber from "flubber";

const shapes = [
  "M39.4,-55.4C49.3,-49.5,54.9,-36.1,60.2,-23.3C65.6,-10.4,70.7,2,68.7,13.7C66.7,25.4,57.6,36.4,46.1,42.4C34.5,48.4,20.4,49.4,5.8,51.3C-8.9,53.2,-23.7,55.9,-36.4,50.8C-49.2,45.7,-59.9,32.8,-65.5,18.2C-71.1,3.5,-71.7,-13,-63.2,-25.6C-54.7,-38.2,-37.1,-46.8,-21.2,-51.4C-5.3,-56,9.8,-56.6,23.6,-55.1C37.5,-53.7,51.3,-50.2,39.4,-55.4Z",
  "M49.3,-62.5C63.1,-50.4,72.5,-31.5,74.3,-13.2C76.1,5.1,70.3,22.8,60.3,34.5C50.4,46.2,36.3,52,22.1,56.1C7.9,60.1,-6.3,62.4,-22.3,61.4C-38.2,60.4,-56,56.2,-63.4,44.3C-70.9,32.4,-68.1,12.9,-66.7,-6.3C-65.2,-25.6,-65.1,-44.7,-55.1,-58.4C-45,-72.1,-25,-80.3,-5.6,-75.5C13.7,-70.6,27.4,-52.7,49.3,-62.5Z"
];

export default function MorphingBlob() {
  const controls = useAnimation();

  useEffect(() => {
    const [from, to] = shapes;
    const interpolator = flubber.interpolate(from, to);
    let progress = 0;
    const duration = 5000; // 5 seconds
    const startTime = performance.now();

    const animate = (time) => {
      progress = (time - startTime) / duration;
      if (progress > 1) progress = 1;
      controls.set({ d: interpolator(progress) });
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Reverse the animation
        const reverseInterpolator = flubber.interpolate(to, from);
        let reverseProgress = 0;
        const reverseStartTime = performance.now();

        const reverseAnimate = (time) => {
          reverseProgress = (time - reverseStartTime) / duration;
          if (reverseProgress > 1) reverseProgress = 1;
          controls.set({ d: reverseInterpolator(reverseProgress) });
          if (reverseProgress < 1) {
            requestAnimationFrame(reverseAnimate);
          } else {
            // Loop the animation
            requestAnimationFrame(() => animate(performance.now()));
          }
        };

        requestAnimationFrame(reverseAnimate);
      }
    };

    requestAnimationFrame(animate);
  }, [controls]);

  return (
    <div className="flex justify-center">
      <motion.svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-32 h-32 md:w-40 md:h-40"
      >
        <motion.path
          fill="url(#blobGradient)"
          d={shapes[0]}
          animate={controls}
          transform="translate(100 100)"
        />
        <defs>
          <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
