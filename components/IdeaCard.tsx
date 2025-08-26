
import React from 'react';
import { Lightbulb } from 'lucide-react';
import { GeneratedIdea } from '../types';

interface IdeaCardProps {
    idea: GeneratedIdea;
    index: number;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, index }) => {
    const animationDelay = `${index * 100}ms`;
    return (
        <div
            className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-secondary animate-fade-in-up"
            style={{ animationDelay }}
        >
            <div className="flex items-center mb-3">
                <Lightbulb className="w-6 h-6 text-secondary mr-3" />
                <h3 className="text-xl font-bold text-gray-800">{idea.title}</h3>
            </div>
            <p className="text-gray-600">{idea.description}</p>
        </div>
    );
};

export default IdeaCard;
