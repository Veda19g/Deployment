import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiUsers, FiFolder, FiClock, FiX, FiCheck, FiAlertCircle } from "react-icons/fi";
// Replace Next.js router with React Router
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Workspace() {
  // Replace useRouter with useNavigate
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newWorkspace, setNewWorkspace] = useState({ name: "", description: "" });
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/v1/workspace/get-workspaces/all", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setWorkspaces(res.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      setError("Failed to load workspaces. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 4000);
  };

  const createWorkspace = async () => {
    if (!newWorkspace.name.trim()) {
      showNotification("Workspace name is required", "error");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/workspace/create",
        newWorkspace,
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      setWorkspaces([...workspaces, res.data]);
      setShowForm(false);
      setNewWorkspace({ name: "", description: "" });
      showNotification("Workspace created successfully");
    } catch (error) {
      console.error("Error creating workspace:", error);
      showNotification("Failed to create workspace", "error");
    }
  };

  // Update this to use navigate instead of router.push
  const navigateToWorkspace = (id) => {
    navigate(`/workspace/${id}`);
  };

  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workspace.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate time since creation for display
  const getTimeAgo = (createdAt) => {
    if (!createdAt) return "Recently";

    const date = new Date(createdAt);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;

    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Notification */}
        <AnimatePresence>
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center ${notification.type === "error"
                ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                : "bg-green-50 text-green-700 border-l-4 border-green-500"
                }`}
            >
              {notification.type === "error" ? <FiAlertCircle className="mr-2" /> : <FiCheck className="mr-2" />}
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container mx-auto p-6 max-w-6xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">Workspaces</h1>
            <p className="text-gray-600">Create and manage your collaborative environments</p>
          </header>

          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search workspaces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {searchTerm ?
                  <FiX className="cursor-pointer" onClick={() => setSearchTerm("")} /> :
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              </span>
            </div>

            {/* Create Workspace Button */}
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <FiPlus className="mr-2" />
              Create Workspace
            </button>
          </div>

          {/* Create Workspace Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Create New Workspace</h2>
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiX size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Workspace Name</label>
                      <input
                        type="text"
                        placeholder="Enter workspace name"
                        value={newWorkspace.name}
                        onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        placeholder="Describe the purpose of this workspace"
                        value={newWorkspace.description}
                        onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowForm(false)}
                        className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={createWorkspace}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
                      >
                        Create Workspace
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && workspaces.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
              <div className="inline-flex items-center justify-center bg-blue-50 p-3 rounded-full mb-4">
                <FiFolder className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No workspaces yet</h3>
              <p className="text-gray-500 mb-4">Create your first workspace to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FiPlus className="mr-2" />
                Create Workspace
              </button>
            </div>
          )}

          {/* Workspaces Grid */}
          {!isLoading && !error && filteredWorkspaces.length > 0 && (
            <>
              {searchTerm && (
                <p className="text-sm text-gray-500 mb-4">
                  Found {filteredWorkspaces.length} {filteredWorkspaces.length === 1 ? 'workspace' : 'workspaces'} matching "{searchTerm}"
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredWorkspaces.map((workspace) => (
                  <motion.div
                    key={workspace._id}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-200"
                  >
                    <div
                      className="p-6 cursor-pointer"
                      onClick={() => navigateToWorkspace(workspace._id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 mb-1 truncate">{workspace.name}</h2>
                          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                            {workspace.description || "No description provided"}
                          </p>
                        </div>

                        {/* Workspace Icon/Avatar - could be replaced with actual workspace image */}
                        <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-2 rounded-lg">
                          <FiFolder size={20} />
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mt-auto">
                        <div className="flex items-center mr-4">
                          <FiUsers className="mr-1" />
                          <span>{workspace.members?.length || 0} members</span>
                        </div>

                        <div className="flex items-center">
                          <FiClock className="mr-1" />
                          <span>{getTimeAgo(workspace.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                      <button
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => navigateToWorkspace(workspace._id)}
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}