import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border-2 border-primary rounded-full pointer-events-none z-[9999] hidden lg:block"
      animate={{
        x: mousePos.x - 16,
        y: mousePos.y - 16,
      }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 250,
        mass: 0.5,
      }}
      style={{
        boxShadow: "0 0 15px rgba(210, 4, 45, 0.5)",
      }}
    />
  );
};