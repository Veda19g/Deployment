import { useState } from "react";
import { signup } from "../actions/actions";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const response = await signup(formData);
    console.log("signup response", response);
    if (response.status) {
      if (response.user) {
        const userCopy = response.user;
        delete userCopy.password;
        localStorage.setItem("user", JSON.stringify(userCopy));
      }
      navigate("/profile");
      return;
    }
    alert("Not allowed. Have a great day :)");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-blue-100">
      {/* Left Side - Signup Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-white shadow-lg p-6 md:p-10">
        <div className="w-full max-w-md">
          <motion.h2
            className="text-3xl font-bold mb-6 text-center text-blue-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Signup
          </motion.h2>
          <motion.p
            className="text-center text-blue-700 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Join ResearchHub to explore research papers and collaborate with
            experts.
          </motion.p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5 }}>
              <label htmlFor="email" className="block text-lg font-medium text-blue-900">Email</label>
              <input id="email" type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.7 }}>
              <label htmlFor="name" className="block text-lg font-medium text-blue-900">Name</label>
              <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.9 }}>
              <label htmlFor="password" className="block text-lg font-medium text-blue-900">Password</label>
              <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </motion.div>
            <motion.button type="submit" className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Register
            </motion.button>
          </form>
          <motion.p className="mt-4 text-center text-blue-900" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}>
            Already have an account? <a href="/signin" className="text-blue-600 hover:underline">Sign in</a>
          </motion.p>
        </div>
      </div>
      {/* Right Side - Image Section */}
      <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-blue-900 text-white p-10">
        <motion.h2 className="text-4xl font-bold mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          Welcome to ResearchHub
        </motion.h2>
        <motion.p className="text-lg text-center max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
          Discover a world of knowledge and connect with researchers worldwide.
        </motion.p>
        <motion.img src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?t=st=1740855914~exp=1740859514~hmac=ec222b308cc8a49fa57d36bac65070bc31dc96b3e2a16f9ec07347e6e5fac4dc&w=900" alt="Signup illustration" className="w-3/4 rounded-lg shadow-lg mt-6" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 1 }} />
      </div>
    </div>
  );
}

export default Signup;
