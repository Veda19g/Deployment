import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Lightbulb, 
  Briefcase, 
  Users, 
  MessageCircle, 
  Mail, 
  Github, 
  Twitter, 
  Linkedin,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

export default function Dashboard() {

  const navigate = useNavigate();

  useEffect(() => {
    // Function to handle scroll animations
    const handleScroll = () => {
      const sections = document.querySelectorAll('.animate-on-scroll');
      
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
          section.classList.add('animate-visible');
        }
      });
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Trigger once on load
    handleScroll();
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = () => {
    navigate("/search");
  };

  const handelworkspace = () => {
    navigate('/workspace');
};

  const handleCommunity = () => {
    navigate('/community');
}

    const handleDiscussions = () => {
        navigate('/discussions');
    }

    const handleIdeas = () => {
        navigate('/research-idea');
    }

    const handleGetStarted = () => {
    navigate('/research-idea');
    }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-sans">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#001F54] via-[#002B5B] to-[#003366] opacity-90"></div>
        <div className="relative container mx-auto px-4 py-32 md:py-40 text-center">
          <div className="animate-float-slow">
            <span className="inline-block bg-[#00A6A6]/20 text-[#00A6A6] text-sm font-semibold px-4 py-2 rounded-full mb-6">
              Transforming Research Collaboration
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-['Montserrat'] text-white tracking-tight leading-tight">
            Discover. <span className="text-[#00A6A6]">Collaborate.</span> Innovate.
          </h2>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-gray-200 leading-relaxed">
            A revolutionary platform designed to transform how researchers collaborate, 
            discover new insights, and accelerate scientific progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleGetStarted} className="bg-[#00A6A6] hover:bg-[#008080] text-white font-bold py-3 px-8 rounded-lg
              transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 group">
              Get Started
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button className="bg-transparent border-2 border-white/30 hover:border-white/70 text-white font-bold py-3 px-8 rounded-lg
              transition-all duration-300 shadow-lg">
              Learn More
            </button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-6xl h-20 bg-white/5 backdrop-blur-lg rounded-t-3xl"></div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 relative z-10">
        {/* Search Papers Section */}
        <section id="search" className="mb-32 animate-on-scroll opacity-0 transition-all duration-1000 ease-out">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-gradient-to-br from-white to-gray-50 p-10 rounded-3xl shadow-xl transform transition-transform duration-500 hover:scale-105 border border-gray-100 group">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#FF6F61]/10 rounded-full blur-xl group-hover:bg-[#FF6F61]/20 transition-all duration-700"></div>
                  <Search size={100} className="text-[#001F54] mx-auto mb-6 relative z-10" />
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <span className="inline-block bg-[#FF6F61]/10 text-[#FF6F61] text-sm font-semibold px-3 py-1 rounded-full mb-4">
                Discover Knowledge
              </span>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 font-['Montserrat'] text-[#001F54] tracking-tight">
                Search Papers & Articles
              </h3>
              <p className="text-lg mb-8 text-gray-600 leading-relaxed">
                Explore a vast repository of academic papers and articles tailored to your research needs.
                Our advanced search algorithms help you find exactly what you're looking for, with powerful filtering and recommendation features.
              </p>
              <button onClick={handleSearch} className="bg-[#FF6F61] hover:bg-[#FF5349] text-white font-bold py-3 px-8 rounded-lg
                transition-all duration-300 flex items-center gap-2 shadow-md group">
                <Search size={20} />
                <span>Explore Research</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </section>

        {/* Generate Ideas Section */}
        <section id="ideas" className="mb-32 animate-on-scroll opacity-0 transition-all duration-1000 ease-out">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-gradient-to-br from-white to-gray-50 p-10 rounded-3xl shadow-xl group border border-gray-100">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#A6E22E]/10 rounded-full blur-xl group-hover:bg-[#A6E22E]/20 transition-all duration-700"></div>
                  <Lightbulb size={100} className="text-[#001F54] mx-auto mb-6 transition-all duration-300 hover:animate-bounce relative z-10" />
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <span className="inline-block bg-[#A6E22E]/10 text-[#7CB518] text-sm font-semibold px-3 py-1 rounded-full mb-4">
                Spark Creativity
              </span>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 font-['Montserrat'] text-[#001F54] tracking-tight">
                Generate Research Ideas
              </h3>
              <p className="text-lg mb-8 text-gray-600 leading-relaxed">
                Get AI-powered research ideas based on your profile and interests.
                Break through creative blocks and discover new research directions with our innovative idea generation tools.
              </p>
              <button onClick={handleIdeas} className="bg-[#A6E22E] hover:bg-[#8BC34A] text-white font-bold py-3 px-8 rounded-lg
                transition-all duration-300 flex items-center gap-2 shadow-md group">
                <Lightbulb size={20} />
                <span>Generate Ideas</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </section>

        {/* Workspace Section */}
        <section id="workspace" className="mb-32 animate-on-scroll opacity-0 translate-x-[-50px] transition-all duration-1000 ease-out">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-gradient-to-br from-white to-gray-50 p-10 rounded-3xl shadow-xl group border border-gray-100">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#00A6A6]/10 rounded-full blur-xl group-hover:bg-[#00A6A6]/20 transition-all duration-700"></div>
                  <Briefcase size={100} className="text-[#001F54] mx-auto mb-6 relative z-10" />
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <span className="inline-block bg-[#00A6A6]/10 text-[#00A6A6] text-sm font-semibold px-3 py-1 rounded-full mb-4">
                Organize & Manage
              </span>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 font-['Montserrat'] text-[#001F54] tracking-tight">
                Workspace
              </h3>
              <p className="text-lg mb-8 text-gray-600 leading-relaxed">
                Organize your research projects, collaborate with peers, and track progress in one place.
                Our intuitive workspace makes research management effortless with powerful tools for organization and collaboration.
              </p>
              <button onClick={handelworkspace} className="bg-[#00A6A6] hover:bg-[#008080] text-white font-bold py-3 px-8 rounded-lg
                transition-all duration-300 flex items-center gap-2 shadow-md group">
                <Briefcase size={20} />
                <span>Open Workspace</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="mb-32 animate-on-scroll opacity-0 transition-all duration-1000 ease-out">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-gradient-to-br from-white to-gray-50 p-10 rounded-3xl shadow-xl group border border-gray-100">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#FF6F61]/10 rounded-full blur-xl group-hover:bg-[#FF6F61]/20 transition-all duration-700"></div>
                  <Users size={100} className="text-[#001F54] mx-auto mb-6 group-hover:animate-pulse transition-all duration-300 relative z-10" />
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <span className="inline-block bg-[#FF6F61]/10 text-[#FF6F61] text-sm font-semibold px-3 py-1 rounded-full mb-4">
                Connect & Network
              </span>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 font-['Montserrat'] text-[#001F54] tracking-tight">
                Community
              </h3>
              <p className="text-lg mb-8 text-gray-600 leading-relaxed">
                Engage with researchers worldwide, share insights, and build connections.
                Join a vibrant community dedicated to advancing knowledge and fostering meaningful collaborations.
              </p>
              <button onClick={handleCommunity} className="bg-[#FF6F61] hover:bg-[#FF5349] text-white font-bold py-3 px-8 rounded-lg
                transition-all duration-300 flex items-center gap-2 shadow-md group">
                <Users size={20} />
                <span>Join Community</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </section>

        {/* Discussions Section */}
        <section id="discussions" className="mb-24 animate-on-scroll opacity-0 transition-all duration-1000 ease-out">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-gradient-to-br from-white to-gray-50 p-10 rounded-3xl shadow-xl group border border-gray-100">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#A6E22E]/10 rounded-full blur-xl group-hover:bg-[#A6E22E]/20 transition-all duration-700"></div>
                  <MessageCircle size={100} className="text-[#001F54] mx-auto mb-6 transition-transform duration-500 group-hover:rotate-12 relative z-10" />
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <span className="inline-block bg-[#A6E22E]/10 text-[#7CB518] text-sm font-semibold px-3 py-1 rounded-full mb-4">
                Exchange Ideas
              </span>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 font-['Montserrat'] text-[#001F54] tracking-tight">
                Discussions
              </h3>
              <p className="text-lg mb-8 text-gray-600 leading-relaxed">
                Participate in discussions, ask questions, and exchange ideas with experts.
                Engage in meaningful conversations that drive research forward and expand your knowledge horizons.
              </p>
              <button onClick={handleDiscussions} className="bg-[#A6E22E] hover:bg-[#8BC34A] text-white font-bold py-3 px-8 rounded-lg
                transition-all duration-300 flex items-center gap-2 shadow-md group">
                <MessageCircle size={20} />
                <span>Start Discussion</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-32 py-16 px-8 bg-gradient-to-r from-[#001F54] to-[#003366] rounded-3xl shadow-xl text-white">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 font-['Montserrat'] tracking-tight">
              Transforming Research <span className="text-[#00A6A6]">Worldwide</span>
            </h3>
            <p className="text-lg max-w-3xl mx-auto text-gray-200">
              Join thousands of researchers who are already using our platform to accelerate their work
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
              <p className="text-4xl font-bold text-[#00A6A6] mb-2">10,000+</p>
              <p className="text-gray-200">Active Researchers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
              <p className="text-4xl font-bold text-[#FF6F61] mb-2">50,000+</p>
              <p className="text-gray-200">Research Papers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
              <p className="text-4xl font-bold text-[#A6E22E] mb-2">5,000+</p>
              <p className="text-gray-200">Collaborations</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
              <p className="text-4xl font-bold text-[#00A6A6] mb-2">100+</p>
              <p className="text-gray-200">Countries</p>
            </div>
          </div>
        </section>
      </main>

      {/* CTA Section */}
      <section className="relative py-20 mb-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#001F54]/90 to-[#003366]/90"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6 font-['Montserrat'] text-white tracking-tight">
            Ready to Transform Your Research Experience?
          </h3>
          <p className="text-xl max-w-3xl mx-auto mb-10 text-gray-200">
            Join our platform today and discover how we can help accelerate your research journey.
          </p>
          <button className="bg-[#00A6A6] hover:bg-[#008080] text-white font-bold py-3 px-8 rounded-lg
            transition-all duration-300 transform hover:scale-105 shadow-lg">
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}


