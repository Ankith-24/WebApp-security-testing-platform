import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, Activity, FileText, Database } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import Results from './pages/Results';
import Reports from './pages/Reports';

const NavLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to === '/scanner' && location.pathname === '/results');

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
        isActive 
          ? 'shadow-neu-inner text-neu-accent' 
          : 'shadow-neu-outer text-neu-text hover:text-neu-accent hover:shadow-neu-outer-hover'
      }`}
    >
      <Icon size={20} />
      <span>{children}</span>
    </Link>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neu-bg flex flex-col">
        {/* Neumorphic Navbar */}
        <nav className="sticky top-0 z-50 py-6 px-8">
          <div className="max-w-7xl mx-auto neu-panel flex justify-between items-center px-8 py-4">
            <div className="flex items-center gap-3 text-2xl font-extrabold text-neu-textdark">
              <div className="p-3 rounded-2xl shadow-neu-outer text-neu-accent">
                <Shield size={28} />
              </div>
              <span>SecuTest<span className="text-neu-accent">Pro</span></span>
            </div>
            <div className="hidden md:flex gap-6">
              <NavLink to="/" icon={Activity}>Dashboard</NavLink>
              <NavLink to="/scanner" icon={Database}>Scanner</NavLink>
              <NavLink to="/reports" icon={FileText}>Reports</NavLink>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-7xl w-full mx-auto p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/results" element={<Results />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
