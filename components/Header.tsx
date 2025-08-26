import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinkClasses = ({ isActive }: { isActive: boolean }): string =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
            isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-teal-100 hover:text-primary'
        }`;

    const navLinks = (
        <>
            <NavLink to="/" className={navLinkClasses}>Dashboard</NavLink>
            <NavLink to="/products" className={navLinkClasses}>Products</NavLink>
            <NavLink to="/customers" className={navLinkClasses}>Customers</NavLink>
            <NavLink to="/reports" className={navLinkClasses}>Reports</NavLink>
            <NavLink to="/transactions" className={navLinkClasses}>Transactions</NavLink>
            <NavLink to="/ai-tool" className={navLinkClasses}>
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-secondary" />
                    AI Idea Generator
                </div>
            </NavLink>
        </>
    );

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
                        <Sparkles className="w-6 h-6" />
                        <span>UMKM Maju AI</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
                        {navLinks}
                    </nav>
                    <div className="hidden md:flex items-center space-x-2">
                        {user && (
                            <>
                                <span className="text-sm text-gray-600">Hi, {user.name}</span>
                                <button onClick={logout} className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:bg-pink-500 transition-colors">
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden animate-fade-in-up">
                    <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
                        {navLinks}
                        <div className="mt-4 w-full px-4">
                           {user && (
                            <>
                                <span className="block text-center text-sm text-gray-600 mb-2">Hi, {user.name}</span>
                                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:bg-pink-500 transition-colors">
                                    Logout
                                </button>
                            </>
                        )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;