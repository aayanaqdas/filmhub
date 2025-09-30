import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo-light.svg";
import homeIcon from "../assets/home-icon.svg";
import tvIcon from "../assets/tv-icon.svg";
import filmIcon from "../assets/film-icon.svg";
import searchIcon from "../assets/search-icon.svg";
import RegionSelect from "./RegionSelect";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("HOME");
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { name: "HOME", icon: homeIcon, path: "/" },
    { name: "MOVIES", icon: filmIcon, path: "/movie" },
    { name: "SERIES", icon: tvIcon, path: "/tv" },
    { name: "SEARCH", icon: searchIcon, path: "/search" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update active tab based on current route
  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath === "/") {
      setActiveTab("HOME");
    } else if (currentPath.startsWith("/movie") || currentPath.startsWith("/movie/")) {
      setActiveTab("MOVIES");
    } else if (currentPath.startsWith("/tv") || currentPath.startsWith("/tv/")) {
      setActiveTab("SERIES");
    } else if (currentPath.startsWith("/search")) {
      setActiveTab("SEARCH");
    } else {
      setActiveTab("");
    }
  }, [location.pathname]);

  const handleNavClick = (item) => {
    setActiveTab(item.name);
    navigate(item.path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full h-18 flex items-center gap-10 px-4 md:px-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/30 backdrop-blur-lg border-b border-white/10"
          : "bg-gradient-to-b from-background/80 via-background/40 to-transparent"
      }`}
    >
      <img src={logo} alt="logo" className="max-w-20 md:block hidden" />

      <div className="flex gap-10 text-white w-full md:w-auto justify-center md:justify-start">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavClick(item)}
            className="flex items-center gap-3 p-1 cursor-pointer"
          >
            <div
              className={`md:hidden pb-2 relative ${
                activeTab === item.name ? "after:w-full" : "after:w-0 hover:after:w-full"
              } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 after:ease-in-out`}
            >
              <img src={item.icon} alt={item.name + " icon"} className="w-5 h-5 min-w-5 min-h-5" />
            </div>
            <div className="hidden md:block">
              <img src={item.icon} alt={item.name + " icon"} className="w-5 h-5 min-w-5 min-h-5" />
            </div>
            <span
              className={`hidden md:block pb-1 mt-0.5 relative ${
                activeTab === item.name ? "after:w-full" : "after:w-0 hover:after:w-full"
              } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 after:ease-in-out`}
            >
              {item.name}
            </span>
          </button>
        ))}
      </div>
      <div className="hidden md:block ml-auto px-4">
        <RegionSelect />
      </div>
    </nav>
  );
}
