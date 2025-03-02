import React, { useEffect } from 'react';
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
export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-[#001F54] to-[#002B5B] text-white py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-1">
                        <h4 className="text-2xl font-bold mb-6 font-['Montserrat'] tracking-tight">
                            <span className="text-[#00A6A6]">Research</span>Hub
                        </h4>
                        <p className="mb-6 text-gray-300">
                            Transforming research collaboration through innovative technology.
                            Connecting researchers worldwide to accelerate scientific discovery.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="bg-white/10 p-2 rounded-full transition-transform duration-300 hover:scale-125 hover:bg-white/20">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="bg-white/10 p-2 rounded-full transition-transform duration-300 hover:scale-125 hover:bg-white/20">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="bg-white/10 p-2 rounded-full transition-transform duration-300 hover:scale-125 hover:bg-white/20">
                                <Github size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xl font-bold mb-6 font-['Montserrat']">Quick Links</h4>
                        <ul className="space-y-3 text-gray-300">
                            <li><a href="#search" className="hover:text-[#00A6A6] transition-colors duration-300">Search</a></li>
                            <li><a href="#ideas" className="hover:text-[#00A6A6] transition-colors duration-300">Ideas</a></li>
                            <li><a href="#workspace" className="hover:text-[#00A6A6] transition-colors duration-300">Workspace</a></li>
                            <li><a href="#community" className="hover:text-[#00A6A6] transition-colors duration-300">Community</a></li>
                            <li><a href="#discussions" className="hover:text-[#00A6A6] transition-colors duration-300">Discussions</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xl font-bold mb-6 font-['Montserrat']">Contact</h4>
                        <p className="flex items-center gap-2 mb-4 text-gray-300">
                            <Mail size={18} className="text-[#00A6A6]" />
                            <span>contact@researchhub.com</span>
                        </p>
                        <p className="text-gray-300 mb-4">
                            123 Innovation Street<br />
                            Research Park, CA 94103
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xl font-bold mb-6 font-['Montserrat']">Newsletter</h4>
                        <p className="mb-4 text-gray-300">Subscribe for the latest updates and research insights.</p>
                        <div className="flex flex-col space-y-3">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="px-4 py-3 rounded-lg focus:outline-none text-gray-800 w-full bg-white/90 focus:bg-white transition-colors duration-300"
                            />
                            <button className="bg-[#00A6A6] hover:bg-[#008080] px-4 py-3 rounded-lg transition-colors duration-300 font-semibold">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 Research Collaboration Platform. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}