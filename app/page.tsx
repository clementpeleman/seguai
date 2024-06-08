'use client';

import { useState } from 'react';

export default function Home() {
    const [topics, setTopics] = useState('');
    const [segues, setSegues] = useState<{ pair: string[], segue: string }[]>([]);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSegues([]);

        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ topics: topics.split(',').map(topic => topic.trim()) }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.error);
            return;
        }

        const data = await response.json();
        setSegues(data.segues);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h1 className="text-4xl text-blue-600 font-bold mb-6 text-left">Segue <span className='text-orange-500'>Generator</span></h1>
                <form onSubmit={handleSubmit} className="mb-6">
                    <label htmlFor="topics" className="block text-lg text-gray-700 mb-2">Onderwerpen (gescheiden door kommas):</label>
                    <input
                        type="text"
                        id="topics"
                        name="topics"
                        value={topics}
                        onChange={(e) => setTopics(e.target.value)}
                        className="mt-1 p-3 border border-gray-300 rounded w-full text-black"
                        placeholder="Bijv. koffie, strips, oorlog, Google"
                    />
                    <button type="submit" className="mt-4 p-3 bg-blue-500 text-white rounded w-full hover:bg-blue-600">Genereer Segue</button>
                </form>
                {error && <p className="text-red-500 text-center">{error}</p>}
                {segues.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-2xl font-semibold mb-4">Gegenereerde Overgangen</h2>
                        <ul className="space-y-4 list-none">
                            {segues.map((s, index) => (
                                <li key={index} className="bg-gray-100 p-4 rounded">
                                    <p className="text-lg "><strong><span className='text-orange-500'>Van </span><span className="text-blue-600">{s.pair[0]}</span><span className='text-orange-500'> naar </span><span className="text-blue-600">{s.pair[1]}</span></strong></p>
                                    <p className="mt-2 text-gray-700">{s.segue}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
