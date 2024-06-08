'use client';

import { useState } from 'react';

export default function Home() {
    const [topics, setTopics] = useState('');
    const [segue, setSegue] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSegue('');

        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ topics: topics.split(',') }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.error);
            return;
        }

        const data = await response.json();
        setSegue(data.segue);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Segue Generator</h1>
                <form onSubmit={handleSubmit} className="mb-4">
                    <label htmlFor="topics" className="block text-gray-700">Onderwerpen (gescheiden door kommas):</label>
                    <input
                        type="text"
                        id="topics"
                        name="topics"
                        value={topics}
                        onChange={(e) => setTopics(e.target.value)}
                        className="mt-2 p-2 border border-gray-300 rounded w-full text-black"
                    />
                    <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">Genereer Segue</button>
                </form>
                {error && <p className="text-red-500">{error}</p>}
                {segue && <p className="mt-4 p-2 bg-green-100 rounded text-gray-700">{segue}</p>}
            </div>
        </div>
    );
}
