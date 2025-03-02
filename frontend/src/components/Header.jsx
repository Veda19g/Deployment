import { useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Search", path: "/search" },
    { name: "Ideas", path: "/research-idea" },
    { name: "Workspace", path: "/workspace" },
    { name: "Community", path: "/community" },
    { name: "Publish", path: "/discussions" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <header className="bg-gradient-to-r from-[#001F54] to-[#003366] text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <h1
          className="text-2xl md:text-3xl font-bold font-['Montserrat'] tracking-tight cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <span className="text-[#00A6A6]">Research</span>Hub
        </h1>

        {/* Hamburger Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex gap-8">
            {navItems.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className={`transition-colors duration-300 font-medium relative nav-link ${
                    location.pathname === item.path
                      ? "text-[#00A6A6] font-bold border-b-2 border-[#00A6A6]"
                      : "hover:text-[#00A6A6]"
                  }`}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="md:hidden bg-[#001F54] text-white py-4">
          <ul className="flex flex-col items-center gap-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className={`block text-lg py-2 ${
                    location.pathname === item.path
                      ? "text-[#00A6A6] font-bold border-b-2 border-[#00A6A6]"
                      : "hover:text-[#00A6A6]"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}