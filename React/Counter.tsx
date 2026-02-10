import React, { useState } from 'react';

const Counter: React.FC = () => {
    const [count, setCount] = useState<number>(0);

    return (
        <div className="p-4 flex flex-col items-center gap-4">
            <h2 className="text-xl">Counter: {count}</h2>
            <div className="flex gap-2">
                <button
                    onClick={() => setCount(count - 1)}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                >
                    Decrement
                </button>
                <button
                    onClick={() => setCount(0)}
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                    Reset
                </button>
                <button
                    onClick={() => setCount(count + 1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Increment
                </button>
            </div>
        </div>
    );
};

export default Counter;
