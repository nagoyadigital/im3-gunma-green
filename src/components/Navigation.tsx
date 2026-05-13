import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/src/lib/utils";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <nav className="flex justify-between items-center px-4 md:px-12 h-20 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <img src="/images/im3gunma.PNG" alt="IM3 Gunma" className="h-12 w-auto" />
        </Link>
        
        <div className="hidden md:flex gap-8 items-center">
          <Link 
            to="/" 
            className={cn(
              "font-sans text-sm transition-colors",
              !isAdmin ? "text-primary font-bold border-b-2 border-secondary-container" : "text-neutral-600 hover:text-secondary"
            )}
          >
            Event Info
          </Link>
          <Link 
            to="/admin" 
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold text-sm active:scale-95 transition-transform"
          >
            Admin Login
          </Link>
        </div>

        <button 
          className="md:hidden text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu size={24} />
        </button>
      </nav>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 p-4 absolute w-full flex flex-col gap-4 shadow-lg">
          <Link to="/" className="text-neutral-600 py-2 border-b border-neutral-50" onClick={() => setIsMenuOpen(false)}>Event Info</Link>
          <Link to="/admin" className="bg-primary text-white text-center py-3 rounded-lg font-semibold" onClick={() => setIsMenuOpen(false)}>Admin Login</Link>
        </div>
      )}
    </header>
  );
}
