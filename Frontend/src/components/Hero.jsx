import { motion } from "framer-motion";
import heroBg from "../assets/images/Untitled-1.jpg";

export function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-contain bg-center bg-no-repeat h-[90vh] relative"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0  bg-opacity-50 z-0" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="flex-1 text-center md:text-left text-white">
          
        </div>
      </div>
    </motion.section>
  );
}
