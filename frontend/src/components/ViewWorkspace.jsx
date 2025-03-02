import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Plus, Users, File, Loader } from "lucide-react";
import { useParams } from "react-router-dom";

export default function ViewWorkspace() {
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [memberEmail, setMemberEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchWorkspace = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/workspace/get-workspace/${workspaceId}`,
          { withCredentials: true, headers: { "Content-Type": "application/json" } }
        );
        setWorkspace(res.data);
        setDocuments(res.data.documents || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching workspace:", error);
        setError("Failed to load workspace. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkspace();
  }, [workspaceId]);

  const addMember = async () => {
    if (!memberEmail.trim()) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8000/api/v1/workspace/add-member`,
        { workspaceId, email: memberEmail },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      
      setWorkspace((prevWorkspace) => ({
        ...prevWorkspace,
        members: [...prevWorkspace.members, { email: memberEmail }],
      }));
      
      setMemberEmail("");
      alert("Member added successfully!");
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Failed to add member. Please check the email and try again.");
    }
  };

  const createDocument = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/workspace/create-document`,
        { workspaceId, name: "Untitled Document" },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      
      setDocuments([...documents, res.data]); // Add new doc to state
    } catch (error) {
      console.error("Error creating document:", error);
      alert("Failed to create document. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-12 h-12 animate-spin text-blue-500" />
          <p className="text-lg text-gray-600">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-md hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Workspace not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{workspace.name}</h1>
          <p className="text-lg text-gray-600 mt-2">{workspace.description || "No description provided"}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Members Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <Users className="mr-2" size={22} />
                Members
              </h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {workspace.members?.length || 0}
              </span>
            </div>

            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <input
                  ref={inputRef}
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === "Enter" && addMember()}
                />
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                  onClick={addMember}
                >
                  <Plus size={18} className="mr-1" />
                  Add
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-64">
              {workspace.members?.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {workspace.members.map((member, index) => (
                    <li key={index} className="py-3 flex items-center">
                      <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium mr-3">
                        {member.email.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-700">{member.email}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic text-center py-4">No members added yet</p>
              )}
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <File className="mr-2" size={22} />
                Documents
              </h2>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {documents?.length || 0}
              </span>
            </div>

            <button
              className="w-full mb-4 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
              onClick={createDocument}
            >
              <Plus size={18} className="mr-2" />
              Create New Document
            </button>

            <div className="overflow-y-auto max-h-64">
              {documents?.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {documents.map((doc) => (
                    <li key={doc._id} className="py-3">
                      <a
                        href={`/documents/${doc._id}`}
                        className="flex items-center text-gray-800 hover:text-blue-600 transition-colors duration-200"
                      >
                        <svg
                          className="h-5 w-5 mr-2 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="font-medium">{doc.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 px-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="mt-2 text-gray-500">No documents created yet</p>
                  <p className="text-sm text-gray-400">Create your first document to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}