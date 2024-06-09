'use client';

import { useState } from 'react';
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import NavBar from "@/components/ui/navbar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Home() {
    const [topics, setTopics] = useState('');
    const [segues, setSegues] = useState<{ pair: string[], segue: string }[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSegues([]);
        setLoading(true);

        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ topics: topics.split(',').map(topic => topic.trim()) }),
        });

        setLoading(false);

        if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.error);
            return;
        }

        const data = await response.json();
        setSegues(data.segues);
    };

    return (
        <BackgroundGradientAnimation className='z-0'>
            {/* <NavBar /> */}
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="z-10 flex flex-col md:flex-row gap-8 w-full max-w-7xl">
                    <div className="w-full md:w-1/2 xl:w-1/3">
                        <form onSubmit={handleSubmit} className="bg-gray-100 bg-opacity-30 backdrop-filter backdrop-blur-lg py-8 px-8 rounded-xl shadow-lg">
                            <label htmlFor="topics" className="block text-2xl font-bold text-indigo-600 mt-3">Subjects</label>
                            <p className="text-gray-600">Enter a list of subjects separated by commas</p>
                            <input
                                type="text"
                                id="topics"
                                name="topics"
                                value={topics}
                                onChange={(e) => setTopics(e.target.value)}
                                className="mt-8 p-3 border border-gray-300 rounded w-full text-black"
                                placeholder="i.e: coffee, comic books, spaghetti, Google"
                            />
                            <button type="submit" className="mt-4 p-3 bg-indigo-600 text-white rounded w-full font-bold hover:bg-blue-700">Generate</button>
                        </form>
                        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                    </div>
                    <div className="w-full md:w-2/3">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            segues.length > 0 && (
                                <div className="bg-gray-100 bg-opacity-30 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-lg">
                                    <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Gegenereerde Overgangen</h2>
                                    <ul className="space-y-4 list-none">
                                        {segues.map((s, index) => {
                                            const title = `${index+1} --> ${index+2}`;
                                            return (
                                                <li key={index} className="bg-gray-100 p-4 rounded-lg">
                                                    <p className="text-lg font-semibold text-indigo-600">{title}</p>
                                                    <p className="mt-2 text-gray-700">{s.segue}</p>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </BackgroundGradientAnimation>
    );
}
