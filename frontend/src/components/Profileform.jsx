import { useState, useEffect } from "react";
import {
  FaPhone,
  FaGlobe,
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaUniversity,
  FaBookOpen,
  FaPlusCircle,
  FaTrash
} from "react-icons/fa";
import { MdOutlineWork, MdEmail, MdSchool } from "react-icons/md";
import { RiFilePaper2Line } from "react-icons/ri";
import { IoPersonOutline } from "react-icons/io5";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    bio: "",
    phone: "",
    website: "",
    twitter: "",
    github: "",
    linkedin: "",
    goggle_scholar_id: "",
    research_gate_id: "",
    orcid_id: "",
    institution: "",
    department: "",
    position: "",
    publications: [],
    interests: [],
    disciplines: [],
    research_areas: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://deployment-mcmr.onrender.com/api/v1/user/get-details",
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.data?.user) {
          console.error("No user data received");
          return;
        }

        const userData = response.data.user;
        setFormData((prev) => ({
          ...prev,
          ...userData,
          publications: userData.publications ?? [],
          interests: userData.interests ?? [],
          disciplines: userData.disciplines ?? [],
          research_areas: userData.research_areas ?? [],
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
        showNotification("Failed to load profile data", "error");
      }
    };

    fetchUserData();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (index, field, value) => {
    const updatedArray = [...(formData[field] || [])];
    updatedArray[index] = value;
    setFormData({ ...formData, [field]: updatedArray });
  };

  const addField = (field) => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), ""] });
  };

  const removeField = (index, field) => {
    const updatedArray = [...(formData[field] || [])];
    updatedArray.splice(index, 1);
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "https://deployment-mcmr.onrender.com/api/v1/user/update",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        showNotification("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification("Failed to update profile", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format field label for display
  const formatLabel = (fieldName) => {
    return fieldName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto my-10 p-8 bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-lg border border-gray-100">
        {notification.show && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${notification.type === "error" ? "bg-red-100 text-red-800 border-red-300" : "bg-green-100 text-green-800 border-green-300"
            } border transition-opacity duration-300`}>
            {notification.message}
          </div>
        )}

        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center font-sans">
          Edit Your Profile
        </h2>
        <p className="text-center text-gray-500 mb-8">Update your academic and professional information</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Bio Section - Full Width */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <IoPersonOutline className="mr-2" /> Personal Information
            </h3>
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ""}
                onChange={handleChange}
                placeholder="Write a brief description about yourself"
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 h-32 bg-gray-50"
              />
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <FaPhone className="mr-2" /> Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "phone", icon: <FaPhone /> },
                { name: "website", icon: <FaGlobe /> },
                { name: "email", icon: <MdEmail /> },
              ].map((field) => formData.hasOwnProperty(field.name) && (
                <div key={field.name}>
                  <label className="block text-gray-600 font-medium mb-2">
                    {formatLabel(field.name)}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {field.icon}
                    </span>
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      placeholder={`Enter your ${field.name}`}
                      className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <FaTwitter className="mr-2" /> Social & Professional Profiles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "twitter", icon: <FaTwitter /> },
                { name: "github", icon: <FaGithub /> },
                { name: "linkedin", icon: <FaLinkedin /> },
                { name: "google scholar id", icon: <MdSchool /> },
                { name: "research_gate_id", icon: <RiFilePaper2Line /> },
                { name: "orcid_id", icon: <FaBookOpen /> },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-gray-600 font-medium mb-2">
                    {formatLabel(field.name)}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {field.icon}
                    </span>
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      placeholder={`Enter your ${field.name.replace("_id", "")}`}
                      className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <FaUniversity className="mr-2" /> Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "institution", icon: <FaUniversity /> },
                { name: "department", icon: <RiFilePaper2Line /> },
                { name: "position", icon: <MdOutlineWork /> },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-gray-600 font-medium mb-2">
                    {formatLabel(field.name)}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {field.icon}
                    </span>
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      placeholder={`Enter your ${field.name}`}
                      className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Fields Section */}
          {["publications", "interests", "disciplines", "research_areas"].map((field) => (
            <div key={field} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <RiFilePaper2Line className="mr-2" /> {formatLabel(field)}
              </h3>

              {formData[field]?.length === 0 ? (
                <p className="text-gray-500 italic mb-4">No {formatLabel(field)} added yet.</p>
              ) : (
                <div className="space-y-3 mb-4">
                  {formData[field]?.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayChange(index, field, e.target.value)}
                        placeholder={`Enter ${field.replace("_", " ")}`}
                        className="flex-1 py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <button
                        type="button"
                        onClick={() => removeField(index, field)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200"
                        aria-label={`Remove ${field} item`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => addField(field)}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition duration-200 font-medium"
              >
                <FaPlusCircle className="mr-2" /> Add {formatLabel(field)}
              </button>
            </div>
          ))}

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full p-4 text-lg font-semibold rounded-lg ${isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                } text-white transition duration-200 shadow-md flex justify-center items-center`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating Profile...
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}