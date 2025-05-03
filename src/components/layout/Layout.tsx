import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, X, Home, Video, Camera, BarChart3, User, Sun, Moon } from 'lucide-react';
import logoLong from '../../assets/logos/logo_long.png';
import logoShort from '../../assets/logos/logo_short.png';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/lessons', label: 'Lessons', icon: <Video className="w-5 h-5" /> },
    { path: '/live-session', label: 'Live Session', icon: <Camera className="w-5 h-5" /> },
    { path: '/parameters', label: 'Parameters', icon: <BarChart3 className="w-5 h-5" /> },
    { path: '/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md z-10`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logoLong} alt="Peak Motion Logo" className="h-10 hidden md:block" />
            <img src={logoShort} alt="Peak Motion Logo" className="h-10 md:hidden" />
          </Link>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme} 
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-[#F99820]' : 'bg-gray-100 text-[#F99820]'}`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu} 
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path
                      ? `${theme === 'dark' ? 'bg-[#2081F9] text-white' : 'bg-[#2081F9] text-white'}`
                      : `${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg z-20`}>
          <nav className="flex flex-col px-4 py-2">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? `${theme === 'dark' ? 'bg-[#2081F9] text-white' : 'bg-[#2081F9] text-white'}`
                    : `${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                }`}
                onClick={toggleMobileMenu}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
      
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className={`py-6 ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'} shadow-inner`}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm"> {new Date().getFullYear()} Peak Motion. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;