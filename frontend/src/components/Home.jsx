import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";

export function Home() {
  const navigate = useNavigate(); // Hook to navigate

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white p-6">
      {/* Spline Background */}
      <div className="absolute inset-0 -z-10">
        <Spline scene="https://prod.spline.design/WgVQOuuQ5cDYUTPd/scene.splinecode" />
      </div>

      {/* Dark Overlay for Better Contrast */}
      <div className="absolute inset-0 bg-black opacity-40 -z-10"></div>

      {/* Content */}
      <motion.div
        className="relative flex flex-col items-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated Heading */}
        <motion.h1
          className="text-6xl font-extrabold mb-4 text-center drop-shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Research Hub
        </motion.h1>

        {/* Animated Subtext */}
        <motion.p
          className="text-lg text-gray-300 mb-8 max-w-lg text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Discover the latest research papers, datasets, and insights with ease.
        </motion.p>

        {/* Buttons Section */}
        <motion.div
          className="flex gap-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Sign In Button */}
          <motion.button
            className="bg-transparent border-2 border-gray-400 px-6 py-3 rounded-2xl font-semibold text-lg hover:bg-gray-400 hover:text-black transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/signin")}
          >
            Sign In
          </motion.button>

          {/* Sign Up Button */}
          <motion.button
            className="bg-gray-600 px-6 py-3 rounded-2xl font-semibold text-lg hover:bg-gray-800 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
