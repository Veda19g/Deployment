import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const fetchScopusDetails = async (scopusId) => {
    const apiKey = "7d96303381f38d04069b84533367e399";  
    try {
        const response = await fetch(`https://api.elsevier.com/content/abstract/scopus_id/${scopusId}`, {
            headers: { "X-ELS-APIKey": apiKey, "Accept": "application/json" }
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        const paper = data["abstracts-retrieval-response"]?.coredata || {};

        return {
            title: paper["dc:title"] || "No Title Available",
            author: typeof paper["dc:creator"] === "string" 
                ? paper["dc:creator"] 
                : paper["dc:creator"]?.$ || "Unknown Author",
            publication: paper["prism:publicationName"] || "Unknown Journal",
            link: paper["prism:url"] || "#",
        };
    } catch (error) {
        console.error("Error fetching Scopus paper details:", error.message);
        return null;
    }
};

export default function ElsevierPaper() {
    const { scopusId } = useParams();
    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!scopusId) return;  // Ensure scopusId exists before fetching

        (async () => {
            const data = await fetchScopusDetails(scopusId);
            setPaper(data);
            setLoading(false);
        })();
    }, [scopusId]);

    if (loading) return <p className="text-blue-500 text-lg mt-6">Loading paper details...</p>;

    return (
        <div className="min-h-screen flex flex-col items-center p-6 bg-white">
            <div className="max-w-3xl bg-blue-50 p-6 rounded-xl shadow-md border border-blue-300">
                {paper ? (
                    <>
                        <h1 className="text-2xl font-bold text-blue-900">{paper.title}</h1>
                        <p className="text-blue-600 mt-2">Author: {paper.author}</p>
                        <p className="text-gray-500 mt-1">Publication: {paper.publication}</p>
                        <a
                            href={paper.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            View Full Paper
                        </a>
                    </>
                ) : (
                    <p className="text-gray-600 text-lg">No details available. Please check the Scopus ID.</p>
                )}
            </div>
        </div>
    );
}
