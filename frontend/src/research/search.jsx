import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Calendar, ExternalLink, Filter, Layers, Search, Tag, User, X } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const sources = ["arXiv", "CORE", "Semantic Scholar", "Elsevier"];

const fetchArxivPapers = async (query, filters) => {
    const { year } = filters;
    let filterQuery = query;

    // if (year) {
    //     filterQuery += `+AND+submittedDate:[${year}0101 TO ${year}1231]`;
    // }

    const response = await fetch(`https://export.arxiv.org/api/query?search_query=all:${filterQuery}&start=0&max_results=10`);
    const text = await response.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    const entries = Array.from(xml.getElementsByTagName("entry"));

    return entries.map(entry => ({
        title: entry.getElementsByTagName("title")[0]?.textContent || "No Title",
        author: entry.getElementsByTagName("author")[0]?.getElementsByTagName("name")[0]?.textContent || "Unknown Author",
        authors: Array.from(entry.getElementsByTagName("author")).map(author =>
            author.getElementsByTagName("name")[0]?.textContent || "Unknown"
        ),
        abstract: entry.getElementsByTagName("summary")[0]?.textContent?.trim() || "No abstract available",
        url: entry.getElementsByTagName("id")[0]?.textContent || "#",
        published: new Date(entry.getElementsByTagName("published")[0]?.textContent || "").getFullYear(),
        category: entry.getElementsByTagName("category")[0]?.getAttribute("term") || "Uncategorized",
        doi: entry.getElementsByTagName("arxiv:doi")?.[0]?.textContent || "N/A",
        source: "arXiv"
    }));
};

const fetchCorePapers = async (query, filters) => {
    const apiKey = "Mcub9FkZ1vmaONfGJpl6St34d8EDVnHh"; // Replace with actual key
    if (!apiKey) return [];

    const { year } = filters;
    let filterQuery = query;

    // if (year) {
    //     filterQuery += ` year:${year}`;
    // }

    try {
        const response = await fetch(`https://api.core.ac.uk/v3/search/works?q=${filterQuery}&limit=10`, {
            headers: { "Authorization": `Bearer ${apiKey}` }
        });
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        return data.results?.map(paper => ({
            title: paper.title || "No Title",
            author: paper.authors?.[0]?.name || "Unknown Author",
            authors: paper.authors?.map(author => author.name) || ["Unknown Author"],
            abstract: paper.abstract || "No abstract available",
            url: paper.identifiers?.[0] || "#",
            published: paper.yearPublished || "N/A",
            category: paper.subjects?.[0] || "Uncategorized",
            doi: paper.doi || "N/A",
            citationCount: paper.citationCount || 0,
            source: "CORE"
        })) || [];
    } catch {
        return [];
    }
};

const fetchSemanticScholarPapers = async (query, filters) => {
    const { year } = filters;
    let filterQuery = query;

    // if (year) {
    //     filterQuery += ` year:${year}`;
    // }

    const response = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?query=${filterQuery}&limit=10&fields=title,authors,abstract,year,venue,citationCount,openAccessPdf,s2FieldsOfStudy`);
    const data = await response.json();

    return data.data?.map(paper => ({
        title: paper.title || "No Title",
        author: paper.authors?.[0]?.name || "Unknown Author",
        authors: paper.authors?.map(author => author.name) || ["Unknown Author"],
        abstract: paper.abstract || "No abstract available",
        url: `https://www.semanticscholar.org/paper/${paper.paperId}` || "#",
        published: paper.year || "N/A",
        category: paper.s2FieldsOfStudy?.[0]?.category || "Uncategorized",
        venue: paper.venue || "N/A",
        citationCount: paper.citationCount || 0,
        openAccess: !!paper.openAccessPdf,
        source: "Semantic Scholar"
    })) || [];
};

const fetchElsevierPapers = async (query, filters) => {
    const apiKey = "7d96303381f38d04069b84533367e399"; // Replace with actual key
    if (!apiKey) return [];

    const { year } = filters;
    let filterQuery = query;

    if (year) {
        filterQuery += ` AND PUBYEAR = ${year}`;
    }

    try {
        const response = await fetch(`https://api.elsevier.com/content/search/scopus?query=${filterQuery}&apiKey=${apiKey}`, {
            headers: { "Accept": "application/json" }
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();

        // Add fallback values for abstract and citationCount
        return data["search-results"]?.entry?.map(paper => ({
            title: paper["dc:title"] || "No Title",
            author: paper["dc:creator"] || "Unknown Author",
            authors: paper.author?.map(a => a.authname) || [paper["dc:creator"] || "Unknown Author"],
            abstract: paper["dc:description"] || "Abstract not available from Elsevier API", // Fallback message
            url: paper.link?.find(l => l["@ref"] === "scopus")?.["@href"] || "#",
            published: paper["prism:coverDate"]?.substring(0, 4) || "N/A",
            category: paper["prism:aggregationType"] || "Uncategorized",
            venue: paper["prism:publicationName"] || "N/A",
            citationCount: parseInt(paper["citedby-count"] || "0"), // Ensure we always have a citation count
            scopusId: paper["dc:identifier"]?.replace("SCOPUS_ID:", ""),
            source: "Elsevier" // Changed source name from "Scopus" to "Elsevier"
        })) || [];
    } catch {
        return [];
    }
};

// Generate array of years from 1990 to current year
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1989 }, (_, i) => String(currentYear - i));

export default function ResearchComponent() {
    const [query, setQuery] = useState("");
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSources, setSelectedSources] = useState(["arXiv"]);
    const [filters, setFilters] = useState({
        year: "",
        sortBy: "relevance", // Options: relevance, date, citations
        openAccessOnly: false
    });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedPaper, setSelectedPaper] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setSelectedPaper(null);
        let results = [];

        if (selectedSources.includes("arXiv")) {
            results = results.concat(await fetchArxivPapers(query, filters));
        }
        if (selectedSources.includes("CORE")) {
            results = results.concat(await fetchCorePapers(query, filters));
        }
        if (selectedSources.includes("Semantic Scholar")) {
            results = results.concat(await fetchSemanticScholarPapers(query, filters));
        }
        if (selectedSources.includes("Elsevier")) {
            results = results.concat(await fetchElsevierPapers(query, filters));
        }

        // Filter by open access if selected
        if (filters.openAccessOnly) {
            results = results.filter(paper => paper.openAccess);
        }

        // Sort results
        switch (filters.sortBy) {
            case "date":
                results.sort((a, b) => (b.published || 0) - (a.published || 0));
                break;
            case "citations":
                results.sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0));
                break;
            // For relevance, we keep the API's default sorting
        }

        setPapers(results);
        setLoading(false);
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            year: "",
            sortBy: "relevance",
            openAccessOnly: false
        });
    };

    return (
        <div>
            <Header />
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900 p-6 flex flex-col items-center">
                <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-md flex flex-col gap-4 border border-blue-200 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search research papers..."
                                className="w-full p-4 pl-12 text-lg bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-xl text-lg font-semibold shadow-md text-white flex items-center gap-2 transition-colors duration-200"
                        >
                            <Search size={20} /> Search
                        </button>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 flex-wrap">
                            {sources.map(source => (
                                <button
                                    key={source}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedSources.includes(source)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    onClick={() => setSelectedSources(prev =>
                                        prev.includes(source)
                                            ? prev.filter(s => s !== source)
                                            : [...prev, source]
                                    )}
                                >
                                    {source}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200"
                        >
                            <Filter size={16} /> Filters {showFilters ? '▲' : '▼'}
                        </button>
                    </div>

                    {showFilters && (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-2">
                            <div className="flex flex-wrap gap-4 mb-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">Year</label>
                                    <select
                                        className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        value={filters.year}
                                        onChange={(e) => handleFilterChange('year', e.target.value)}
                                    >
                                        <option value="">Any year</option>
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">Sort by</label>
                                    <select
                                        className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        value={filters.sortBy}
                                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                    >
                                        <option value="relevance">Relevance</option>
                                        <option value="date">Most Recent</option>
                                        <option value="citations">Most Cited</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2 self-end">
                                    <input
                                        type="checkbox"
                                        id="openAccess"
                                        checked={filters.openAccessOnly}
                                        onChange={(e) => handleFilterChange('openAccessOnly', e.target.checked)}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="openAccess" className="text-sm font-medium text-gray-700">Open Access Only</label>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-gray-200 hover:bg-gray-300 text-gray-700"
                                >
                                    <X size={14} /> Clear Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {loading && (
                    <div className="w-full max-w-4xl flex justify-center p-8">
                        <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="text-blue-600">Searching academic databases...</p>
                        </div>
                    </div>
                )}

                <div className="w-full max-w-4xl">
                    {selectedPaper ? (
                        <div className="bg-white p-6 rounded-xl shadow-md border border-blue-200">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-blue-800">{selectedPaper.title}</h2>
                                <button
                                    onClick={() => setSelectedPaper(null)}
                                    className="p-2 rounded-full hover:bg-gray-100"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600 mb-4">
                                <User size={16} />
                                <p>
                                    {selectedPaper.authors && selectedPaper.authors.length > 1
                                        ? `${selectedPaper.authors[0]} et al.`
                                        : selectedPaper.author}
                                </p>

                                {selectedPaper.published && (
                                    <>
                                        <span className="mx-2">•</span>
                                        <Calendar size={16} />
                                        <p>{selectedPaper.published}</p>
                                    </>
                                )}

                                {selectedPaper.source && (
                                    <>
                                        <span className="mx-2">•</span>
                                        <Book size={16} />
                                        <p>{selectedPaper.source}</p>
                                    </>
                                )}
                            </div>

                            {selectedPaper.category && (
                                <div className="flex items-center gap-2 mb-4">
                                    <Tag size={16} className="text-blue-500" />
                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                        {selectedPaper.category}
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Abstract</h3>
                                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    {selectedPaper.abstract}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {selectedPaper.venue && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <h4 className="text-sm font-semibold text-gray-700">Venue/Journal</h4>
                                        <p>{selectedPaper.venue}</p>
                                    </div>
                                )}

                                {selectedPaper.citationCount !== undefined && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <h4 className="text-sm font-semibold text-gray-700">Citations</h4>
                                        <p>{selectedPaper.citationCount}</p>
                                    </div>
                                )}

                                {selectedPaper.doi && selectedPaper.doi !== "N/A" && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <h4 className="text-sm font-semibold text-gray-700">DOI</h4>
                                        <p>{selectedPaper.doi}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <a
                                    href={selectedPaper.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                                >
                                    View Paper <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>
                    ) : (
                        papers.length > 0 ? (
                            <div className="space-y-4">
                                {papers.map((paper, index) => (
                                    <div
                                        key={index}
                                        className="bg-white p-5 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-all cursor-pointer"
                                        onClick={() => setSelectedPaper(paper)}
                                    >
                                        <div className="flex justify-between">
                                            <h3 className="text-xl font-bold text-blue-800 mb-2">{paper.title}</h3>
                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                                                {paper.source}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600 mb-2 text-sm">
                                            <User size={14} />
                                            <p>
                                                {paper.authors && paper.authors.length > 1
                                                    ? `${paper.authors[0]} et al.`
                                                    : paper.author}
                                            </p>

                                            {paper.published && (
                                                <>
                                                    <span className="mx-1">•</span>
                                                    <Calendar size={14} />
                                                    <p>{paper.published}</p>
                                                </>
                                            )}

                                            {paper.citationCount !== undefined && (
                                                <>
                                                    <span className="mx-1">•</span>
                                                    <Layers size={14} />
                                                    <p>{paper.citationCount} citations</p>
                                                </>
                                            )}
                                        </div>

                                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                            {paper.abstract.substring(0, 200)}
                                            {paper.abstract.length > 200 ? '...' : ''}
                                        </p>

                                        {paper.category && (
                                            <div className="flex items-center gap-1 mb-2">
                                                <Tag size={14} className="text-blue-500" />
                                                <span className="text-blue-600 text-xs">{paper.category}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-end mt-2">
                                            <div className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 text-sm">
                                                View details <ExternalLink size={14} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            !loading && query &&
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-blue-100 text-center">
                                <p className="text-gray-600 text-lg mb-2">No research papers found.</p>
                                <p className="text-gray-500">Try adjusting your search terms or filters.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}