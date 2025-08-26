import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register, user } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
            navigate('/', { replace: true });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                 <div className="text-center mb-8">
                     <Link to="/" className="inline-flex items-center gap-2 text-3xl font-bold text-primary">
                        <Sparkles className="w-8 h-8" />
                        <span>UMKM Maju AI</span>
                    </Link>
                    <p className="text-gray-500 mt-2">Your Business Dashboard</p>
                </div>
                <div className="bg-white rounded-lg shadow-2xl p-8 animate-fade-in-up">
                    <div className="flex border-b mb-6">
                        <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-center font-semibold ${isLogin ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>
                            Login
                        </button>
                        <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-center font-semibold ${!isLogin ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>
                            Register
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6 text-content">{isLogin ? 'Welcome Back!' : 'Create Your Account'}</h2>
                    <form onSubmit={handleSubmit}>
                        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</p>}
                        {!isLogin && (
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400">
                            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// A dummy link component to avoid errors since this page is outside the main router context with a layout
const Link: React.FC<{ to: string; className: string; children: React.ReactNode }> = ({ to, className, children }) => (
    <a href={`#${to}`} className={className}>{children}</a>
);


export default LoginPage;