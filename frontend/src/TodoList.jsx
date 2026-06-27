import { useEffect, useState } from 'react';
import { Search, Plus, CheckCircle2, Circle, Calendar, ChevronRight, LayoutDashboard } from 'lucide-react';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetch(`${API_URL}/api/todos`)
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error(err));
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const res = await fetch(`${API_URL}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: "Added via web dashboard" })
    });
    
    if (res.ok) {
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      setTitle("");
    }
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || todo.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    // Premium Background with subtle gradient
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans pb-16">
      
      {/* Frosted Glass Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-200">
              <LayoutDashboard size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">TaskFlow</h1>
          </div>
          
          <div className="text-sm font-medium text-slate-500">
            {todos.filter(t => t.status === 'completed').length} / {todos.length} Completed
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-10">
        
        {/* Top Control Panel (Search, Filter, Add) */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-10 flex flex-col md:flex-row gap-4 items-center">
          
          <form onSubmit={addTodo} className="flex-1 flex w-full gap-3">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="What needs to be done?" 
              className="flex-1 bg-slate-50 border-0 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500 text-slate-700 placeholder:text-slate-400 transition-all shadow-inner"
              required
            />
            <button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-200 flex items-center gap-2 cursor-pointer"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </form>

          <div className="h-10 w-px bg-slate-200 hidden md:block"></div>

          <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-700 transition-all"
              />
            </div>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border-0 rounded-xl px-4 py-3.5 text-slate-700 font-medium cursor-pointer focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Done</option>
            </select>
          </div>
        </div>

        {/* Task Grid */}
        <div className="grid gap-4">
          {filteredTodos.map((todo) => (
            <a href={`/todo.html?id=${todo.id}`} key={todo.id} className="block group cursor-pointer">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-5">
                
                {/* Custom Checkbox Design */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                  todo.status === 'completed' 
                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                    : 'border-slate-300 group-hover:border-indigo-400 text-transparent'
                }`}>
                  <CheckCircle2 size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-semibold truncate transition-colors ${
                    todo.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800 group-hover:text-indigo-600'
                  }`}>
                    {todo.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 opacity-70">
                    <span className="flex items-center text-xs text-slate-500 gap-1.5">
                      <Calendar size={14} />
                      {new Date(todo.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-indigo-500">
                  <ChevronRight size={24} />
                </div>
              </div>
            </a>
          ))}

          {/* Premium Empty State */}
          {filteredTodos.length === 0 && (
            <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
              <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
                <Search className="text-indigo-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No tasks found</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                {todos.length === 0 
                  ? "You have a clean slate! Start by adding a new task to your workflow above." 
                  : "We couldn't find any tasks matching your current search or filter."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}