import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

export default function Community() {
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("https://api.openalex.org/sources") // Corrected API endpoint
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setJournals(data.results || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching journals:", error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const filteredJournals = journals.filter((journal) =>
        journal.display_name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <Header />
            <div className="p-10 min-h-screen flex flex-col items-center">
                <input
                    type="text"
                    placeholder="Search journals..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-6 p-3 border border-gray-300 rounded-lg w-2/3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader className="animate-spin text-blue-600" size={36} />
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-lg font-medium">Error: {error}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-10">
                        {filteredJournals.length > 0 ? (
                            filteredJournals.map((journal) => (
                                <div key={journal.id} className="p-6 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{journal.display_name}</h2>
                                    <p className="text-gray-600 mb-3">{journal.issn ? `ISSN: ${journal.issn}` : "No ISSN available"}</p>
                                    <a
                                        href={journal.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 font-medium hover:underline"
                                    >
                                        View Journal
                                    </a>
                                </div>
                            ))
                        ) : (
                            <div className="text-lg text-gray-700 font-medium">No journals found.</div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
