
import React, { useState } from 'react';
import { GiftIdea } from '../types';
import { generateGiftIdeas } from '../services/geminiService';
import { SparklesIcon, GiftIcon } from './Icons';

const GiftFinder: React.FC = () => {
    const [recipient, setRecipient] = useState('');
    const [occasion, setOccasion] = useState('');
    const [budget, setBudget] = useState('');
    const [ideas, setIdeas] = useState<GiftIdea[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipient || !occasion || !budget) {
            setError('Please fill out all fields to find the perfect gift.');
            return;
        }
        setError(null);
        setLoading(true);
        setIdeas([]);

        try {
            const result = await generateGiftIdeas(recipient, occasion, budget);
            setIdeas(result);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-givora-pink to-givora-purple p-6 md:p-8 rounded-xl shadow-lg mb-12">
            <div className="flex items-center mb-4">
                <SparklesIcon className="w-8 h-8 text-white mr-3" />
                <h2 className="text-2xl md:text-3xl font-playfair font-bold text-white">AI Gift Finder</h2>
            </div>
            <p className="text-white mb-6">Feeling stuck? Describe your needs and let our AI find the perfect gift ideas for you!</p>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Who is it for? (e.g., Mom)"
                    className="col-span-1 md:col-span-1 p-3 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-white"
                />
                <input
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    placeholder="What's the occasion? (e.g., Birthday)"
                    className="col-span-1 md:col-span-1 p-3 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-white"
                />
                <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Budget? (e.g., under $50)"
                    className="col-span-1 md:col-span-1 p-3 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="col-span-1 md:col-span-1 bg-white text-givora-charcoal font-bold py-3 px-6 rounded-lg hover:bg-givora-orange transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-t-transparent border-givora-charcoal rounded-full animate-spin"></div>
                    ) : (
                        <>
                        <GiftIcon className="w-5 h-5 mr-2" />
                        Find Gifts
                        </>
                    )}
                </button>
            </form>

            {error && <p className="text-red-100 mt-4 bg-red-500 bg-opacity-50 p-3 rounded-lg">{error}</p>}
            
            {ideas.length > 0 && (
                 <div className="mt-8 bg-white bg-opacity-20 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-4">Here are a few ideas!</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {ideas.map((idea, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow">
                                <h4 className="font-bold text-givora-charcoal">{idea.name}</h4>
                                <p className="text-sm text-gray-600">{idea.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GiftFinder;
