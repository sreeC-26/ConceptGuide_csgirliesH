import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import AuthModal from './AuthModal';

export default function TopNavBar({ onHomeClick, onHistoryToggle, isHistoryOpen = false, isDesktop = true }) {
  const { pdfDocument, qaData } = useAppStore();
  const { user, signOut } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHome = () => {
    useAppStore.getState().reset();
    if (onHomeClick) onHomeClick();
    setMobileMenuOpen(false);
  };

  const handleAuthClick = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  // Close mobile menu when navigating
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };


  // Style home link differently when Q&A session is active
  const homeLinkStyle = {
    fontFamily: 'Poppins, sans-serif',
    background: qaData ? '#1A1A1A' : 'linear-gradient(135deg, #FF4081 0%, #E0007A 100%)',
    color: '#FFFFFF',
    border: qaData ? '1px solid #FF4081' : 'none',
    textDecoration: 'none',
  };

  if (qaData) {
    homeLinkStyle.backgroundColor = '#1A1A1A';
  }

  const historyLinkStyle = {
    fontFamily: 'Poppins, sans-serif',
    backgroundColor: '#1A1A1A',
    color: '#FFFFFF',
    border: '1px solid #FF4081',
    textDecoration: 'none',
  };

  return (
    <>
      <div
        className="w-full h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 flex-shrink-0 relative z-50"
        style={{
          backgroundColor: '#2D2D2D',
          borderBottom: '1px solid #FF4081',
        }}
      >
        {/* Logo and app name */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            onClick={handleHome}
            className="flex items-center gap-1 sm:gap-3"
            style={{ textDecoration: 'none' }}
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 w-10 sm:h-14 md:h-20 sm:w-14 md:w-20 object-contain"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
            <h1
              className="text-lg sm:text-xl md:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF' }}
            >
              ConceptGuide
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          {!isDesktop && pdfDocument && (
            <span
              className="hidden text-sm font-medium text-pink-200/70 lg:block"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {pdfDocument?.name || 'Session Active'}
            </span>
          )}

          <Link
            to="/"
            onClick={handleHome}
            className="px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80 inline-flex items-center justify-center text-center text-sm lg:text-base"
            style={homeLinkStyle}
          >
            Home
          </Link>

          <Link
            to="/history"
            className="px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80 inline-flex items-center justify-center text-center text-sm lg:text-base"
            style={historyLinkStyle}
          >
            History
          </Link>
          <Link 
            to="/goals" 
            className="px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80 inline-flex items-center justify-center text-center text-sm lg:text-base"
            style={historyLinkStyle}
          >
            Goals
          </Link>
          <Link 
            to="/analytics" 
            className="px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80 inline-flex items-center justify-center text-center text-sm lg:text-base"
            style={historyLinkStyle}
          >
            Analytics
          </Link>

          {user ? (
            <button
              onClick={handleSignOut}
              className="px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80 text-sm lg:text-base"
              style={{
                fontFamily: 'Poppins, sans-serif',
                backgroundColor: '#1A1A1A',
                color: '#FFFFFF',
                border: '1px solid #FF4081',
              }}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleAuthClick}
              className="px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80 text-sm lg:text-base"
              style={{
                fontFamily: 'Poppins, sans-serif',
                backgroundColor: '#1A1A1A',
                color: '#FFFFFF',
                border: '1px solid #FF4081',
              }}
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-white hover:bg-pink-500/20 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden absolute top-14 left-0 right-0 z-40 border-b border-pink-500/30"
          style={{ backgroundColor: '#2D2D2D' }}
        >
          <div className="flex flex-col p-4 gap-2">
          <Link
            to="/"
            onClick={handleHome}
            className="px-4 py-3 rounded-lg transition-all duration-200 hover:opacity-80 text-center"
            style={homeLinkStyle}
          >
            Home
          </Link>

          <Link
            to="/history"
            onClick={handleNavClick}
            className="px-4 py-3 rounded-lg transition-all duration-200 hover:opacity-80 text-center"
            style={historyLinkStyle}
          >
            History
          </Link>
          
          <Link 
            to="/goals"
            onClick={handleNavClick}
            className="px-4 py-3 rounded-lg transition-all duration-200 hover:opacity-80 text-center"
            style={historyLinkStyle}
          >
            Goals
          </Link>
          
          <Link 
            to="/analytics"
            onClick={handleNavClick}
            className="px-4 py-3 rounded-lg transition-all duration-200 hover:opacity-80 text-center"
            style={historyLinkStyle}
          >
            Analytics
          </Link>

            <div className="border-t border-pink-500/30 pt-2 mt-2">
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-3 rounded-lg transition-all duration-200 hover:opacity-80"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    backgroundColor: '#1A1A1A',
                    color: '#FFFFFF',
                    border: '1px solid #FF4081',
                  }}
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleAuthClick}
                  className="w-full px-4 py-3 rounded-lg transition-all duration-200 hover:opacity-80"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    backgroundColor: '#1A1A1A',
                    color: '#FFFFFF',
                    border: '1px solid #FF4081',
                  }}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </>
  );
}
