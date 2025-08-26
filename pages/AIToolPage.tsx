

import React, { useState } from 'react';
import { generateIdeas } from '../services/geminiService';
import { GeneratedIdea } from '../types';
import Spinner from '../components/Spinner';
import IdeaCard from '../components/IdeaCard';
import { Lightbulb } from 'lucide-react';

const AIToolPage: React.FC = () => {
    const [businessType, setBusinessType] = useState('');
    const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!businessType.trim()) {
            setError('Please enter a business field.');
            return;
        }
        setError(null);
        setLoading(true);
        setIdeas([]);

        try {
            const result = await generateIdeas(businessType);
            setIdeas(result);
        } catch (err) {
            setError('Failed to generate ideas. Please check your API key and try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg mb-8">
                <Lightbulb className="mx-auto h-16 w-16 text-secondary mb-4" />
                <h1 className="text-4xl font-extrabold text-primary mb-3">AI Business Idea Generator</h1>
                <p className="text-gray-600">
                    Unleash your creativity! Enter your business field, and our AI will brainstorm innovative product or service ideas for you.
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        placeholder="e.g., Coffee Shop, Handmade Jewelry, Pet Care"
                        className="flex-grow px-4 py-2 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 flex items-center justify-center"
                    >
                        {loading ? <Spinner /> : 'Generate Ideas'}
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            </div>

            <div className="mt-8">
                {loading && <Spinner />}
                {ideas.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ideas.map((idea, index) => (
                           <IdeaCard key={index} idea={idea} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIToolPage;