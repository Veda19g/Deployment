import { useEffect, useState } from "react";
import axios from "axios";
import { Lightbulb, Loader2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

const ResearchIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIdea, setExpandedIdea] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://deployment-mcmr.onrender.com/api/v1/research/generate-ideas", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.success) {
          const rawIdeas = response.data.data.ideas;
          const parsedIdeas = parseResearchIdeas(rawIdeas);
          setIdeas(parsedIdeas);
        }
      })
      .catch((error) => {
        console.error("Error fetching research ideas:", error);
        setError("Failed to fetch research ideas. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const parseResearchIdeas = (rawText) => {
    const parsedIdeas = [];

    const ideaBlocks = rawText.split(/\d+\.\s+\*\*/).slice(1);

    ideaBlocks.forEach(block => {
      try {
        const titleMatch = block.match(/^(.*?)\*\*/);
        const title = titleMatch ? titleMatch[1].trim() : "";

        parsedIdeas.push({ title, details: block.trim() });
      } catch (error) {
        console.error("Error parsing idea block:", error);
      }
    });

    return parsedIdeas;
  };

  const toggleExpand = (index) => {
    setExpandedIdea(expandedIdea === index ? null : index);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-lg text-gray-700">Generating research ideas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-lg text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="p-6 max-w-4xl mx-auto py-12">
        <header className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <Lightbulb className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Research Ideas</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            AI-generated research ideas tailored to your interests.
          </p>
        </header>

        <div className="space-y-6">
          {ideas.map((idea, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${expandedIdea === index ? 'ring-2 ring-indigo-500' : 'hover:shadow-lg'
                }`}
            >
              <div
                className="p-6 cursor-pointer flex items-center justify-between"
                onClick={() => toggleExpand(index)}
              >
                <h2 className="text-xl font-bold text-gray-800">{idea.title}</h2>
                {expandedIdea === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </div>

              {expandedIdea === index && (
                <div className="p-6 border-t border-gray-200 animate-fadeIn">
                  <p className="text-gray-700 whitespace-pre-line">{idea.details}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResearchIdeas;
