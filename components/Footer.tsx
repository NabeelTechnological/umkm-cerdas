
import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                        <p className="font-bold text-lg">UMKM Maju AI</p>
                        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
                    </div>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
