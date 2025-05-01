import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { interpolate } from "flubber";

const blobShapes = [
  "M43.5,-75.6C55.8,-67.2,64.8,-55,69.4,-42C74,-28.9,74.1,-14.5,70.3,-2.1C66.4,10.3,58.6,20.6,51.3,32.4C44.1,44.1,37.5,57.3,27.2,62.9C16.8,68.5,2.8,66.6,-9.3,61.5C-21.5,56.4,-31.9,48,-45.1,39.6C-58.4,31.3,-74.5,23,-78.4,10.8C-82.2,-1.4,-73.8,-17.5,-66.6,-33.3C-59.4,-49.1,-53.5,-64.6,-42.5,-73.6C-31.4,-82.6,-15.7,-85,-1.2,-83.1C13.4,-81.2,26.8,-75.1,43.5,-75.6Z",
  "M38.1,-60.4C49.6,-54.4,59.4,-43.9,65.2,-31.6C71.1,-19.4,73.1,-5.4,70.4,8.8C67.6,22.9,60.1,37.1,49.7,47.4C39.3,57.7,25.9,64.1,12.1,67.2C-1.8,70.3,-15.9,70.2,-28.8,65.3C-41.7,60.3,-53.4,50.5,-59.7,38.5C-66,26.6,-67,12.4,-63.4,0.2C-59.9,-12.1,-51.8,-24.2,-45,-37.4C-38.3,-50.6,-32.8,-64.9,-22.1,-70.7C-11.5,-76.6,4.4,-73.9,20.4,-71.4C36.3,-68.9,51.4,-66.5,38.1,-60.4Z"
];

export default function MorphingBlob() {
  const [index, setIndex] = useState(0);
  const nextIndex = (index + 1) % blobShapes.length;

  const interpolator = interpolate(blobShapes[index], blobShapes[nextIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % blobShapes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="w-40 h-40 md:w-48 md:h-48"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6 }}
    >
      <motion.path
        fill="url(#gradient)"
        d={interpolator(1)} // use the fully morphed path at each step
        transition={{ duration: 3 }}
        transform="translate(100 100)"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d946ef" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}
