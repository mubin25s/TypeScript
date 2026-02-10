import React, { useState } from 'react';

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState<string>('');

    const addTodo = () => {
        if (inputValue.trim() === '') return;
        const newTodo: Todo = {
            id: Date.now(),
            text: inputValue,
            completed: false,
        };
        setTodos([...todos, newTodo]);
        setInputValue('');
    };

    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Todo List</h2>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="Add a new task..."
                />
                <button
                    onClick={addTodo}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    Add
                </button>
            </div>
            <ul className="space-y-2">
                {todos.map(todo => (
                    <li key={todo.id} className="flex items-center justify-between border-b pb-2">
                        <span
                            onClick={() => toggleTodo(todo.id)}
                            className={`cursor-pointer ${todo.completed ? 'line-through text-gray-400' : ''}`}
                        >
                            {todo.text}
                        </span>
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            className="bg-red-400 text-white px-2 py-1 text-xs rounded"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
