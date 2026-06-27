import { useEffect, useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  // Fetch all todos from your backend when the page loads
  useEffect(() => {
    fetch('http://localhost:3000/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error("Error fetching todos:", err));
  }, []);

  // Handle adding a new task
  const addTodo = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: "Added via web dashboard" })
      });
      
      if (res.ok) {
        const newTodo = await res.json();
        // Update the UI immediately with the new task
        setTodos([newTodo, ...todos]);
        setTitle(""); // Clear the input field
      }
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">My Tasks</h1>
      
      {/* Form to create a new task */}
      <form onSubmit={addTodo} className="mb-8 flex gap-4">
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="What needs to be done?" 
          required 
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow-sm cursor-pointer"
        >
          Add Task
        </button>
      </form>
      
      {/* Display the list of tasks */}
      <ul className="space-y-4">
        {todos.map(todo => (
          <li key={todo.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
            
            {/* The MPA Link: Notice the hard <a href> pointing to our second HTML file */}
            <a href={`/todo.html?id=${todo.id}`} className="block cursor-pointer">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition">
                  {todo.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  todo.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {todo.status.toUpperCase()}
                </span>
              </div>
            </a>

          </li>
        ))}
        
        {/* Empty state if no tasks exist */}
        {todos.length === 0 && (
          <p className="text-gray-500 text-center py-8">No tasks yet. Add one above!</p>
        )}
      </ul>
    </div>
  );
}