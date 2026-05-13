import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <img src="/images/logo-header.png" alt="IM3 Gunma" className="h-14 w-auto" />
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          <a href="#" className="text-neutral-500 hover:text-secondary text-sm font-medium transition-colors">Facebook</a>
          <a href="#" className="text-neutral-500 hover:text-secondary text-sm font-medium transition-colors">Instagram</a>
          <a href="#" className="text-neutral-500 hover:text-secondary text-sm font-medium transition-colors">YouTube</a>
          <a href="#" className="text-neutral-500 hover:text-secondary text-sm font-medium transition-colors">Partner</a>
        </div>
        
        <div className="text-neutral-500 text-sm md:text-right max-w-sm">
          © 1447 H IM3 Gunma. Powered by <a href="https://nagoyadigital.com" target="_blank" className="text-neutral-700 hover:text-secondary font-medium underline transition-colors">Nagoya Digital</a>.
        </div>
      </div>
    </footer>
  );
}
