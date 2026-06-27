import { useEffect, useState } from 'react';
import './index.css';

export default function SingleTodo() {
  const [todo, setTodo] = useState(null);
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/api/todos/${id}`)
        .then(res => res.json())
        .then(data => setTodo(data));
    }
  }, [id]);

  // UPDATE: Mark as completed
  const handleComplete = async () => {
    await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' })
    });
    // Update local state to reflect the change instantly
    setTodo({ ...todo, status: 'completed' });
  };

  // DELETE: Remove item and redirect
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: 'DELETE'
    });
    
    // In an MPA, we use standard window methods to redirect back to the home page
    window.location.href = '/index.html'; 
  };

  if (!todo) return <div className="p-8 text-center text-gray-500">Loading task...</div>;

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <a href="/index.html" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Back to Dashboard
      </a>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{todo.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            todo.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {todo.status.toUpperCase()}
          </span>
        </div>
        
        <p className="text-gray-600 mb-6">{todo.description}</p>
        <p className="text-sm text-gray-400 mb-8">
          Created: {new Date(todo.created_at).toLocaleString()}
        </p>

        <div className="flex gap-4">
          {todo.status !== 'completed' && (
            <button 
              onClick={handleComplete}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Mark as Completed
            </button>
          )}
          <button 
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}