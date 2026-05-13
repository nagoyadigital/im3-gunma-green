import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background-sage">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
