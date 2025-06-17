import React from 'react';
import { ActiveSection, User } from '../types';

interface HeaderProps {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  isAuthenticated: boolean;
  user: User | null;
  onLogout: () => void;
  onNavigateToLogin: () => void; // Simplified navigation to login
}

const NavItem: React.FC<{
  label: string;
  isActive?: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => {
  const baseClasses = `px-4 py-2 text-sm font-medium rounded-md transition-colors`;
  const activeClasses = isActive ? 'bg-teal-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white';
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${activeClasses}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
    </button>
  );
};


export const Header: React.FC<HeaderProps> = ({ 
  activeSection, 
  setActiveSection, 
  isAuthenticated, 
  user,
  onLogout,
  onNavigateToLogin
}) => {
  return (
    <header className="bg-slate-850 p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold text-teal-400">DevVitals</h1>
        <nav className="flex space-x-2 items-center">
          {isAuthenticated && user ? ( // User is always verified in demo
            <>
              <NavItem label="Log Today" isActive={activeSection === 'log'} onClick={() => setActiveSection('log')} />
              <NavItem label="Journal" isActive={activeSection === 'journal'} onClick={() => setActiveSection('journal')} />
              <NavItem label="Dashboard" isActive={activeSection === 'dashboard'} onClick={() => setActiveSection('dashboard')} />
              <NavItem label="Settings" isActive={activeSection === 'settings'} onClick={() => setActiveSection('settings')} />
              <span className="text-sm text-slate-400 hidden sm:block">Hi, {user.email.split('@')[0]}</span>
              <NavItem label="Logout" onClick={onLogout} />
            </>
          ) : (
            <>
              <NavItem label="Login" isActive={activeSection === 'login'} onClick={onNavigateToLogin} />
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
