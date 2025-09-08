import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-6">This is your todo list</h1>
        <div className="flex items-center justify-center min-h-screen">
            <div className="space-x-4">
                <Link
                    to="/tasks"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Tasks
                </Link>
            </div>
        </div>
    </div>
    );
};

export default Home;