import { useEffect, useState } from 'react';
import { Search, Plus, CheckCircle2, Calendar, ChevronRight, LayoutDashboard, X, Trash2, Tag, AlertCircle, Flag, ArrowUpDown } from 'lucide-react';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest"); // NEW: Sort state
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState("");
  const [priority, setPriority] = useState("Low");
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchTodos = () => {
    fetch(`${API_URL}/api/todos`)
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const res = await fetch(`${API_URL}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title, 
        description,
        due_date: date,
        tags: tags,
        priority: priority
      })
    });
    
    if (res.ok) {
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      // Reset form
      setTitle("");
      setDescription("");
      setDate("");
      setTags("");
      setPriority("Low");
      setIsFormOpen(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    const res = await fetch(`${API_URL}/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) fetchTodos();
  };

  const deleteTodo = async (id) => {
    const res = await fetch(`${API_URL}/api/todos/${id}`, { method: 'DELETE' });
    if (res.ok) fetchTodos();
  };

  // UPGRADED: Filter and THEN Sort the tasks
  const filteredAndSortedTodos = todos
    .filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || todo.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Using ID to sort because it increments chronologically
      if (sortOrder === "newest") {
        return b.id - a.id; 
      } else {
        return a.id - b.id; 
      }
    });

  const getPriorityColor = (prio) => {
    switch(prio) {
      case 'Urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Premium Glass Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-200">
              <LayoutDashboard size={22} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">TaskFlow</h1>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">
            <span className="text-sm font-semibold text-indigo-600">
              {todos.filter(t => t.status === 'completed').length}
            </span>
            <span className="text-sm font-medium text-slate-500">/ {todos.length} Completed</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-8">
        
        {/* Dashboard Control Panel */}
        {!isFormOpen && (
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-2 items-center justify-between">
            <div className="flex flex-wrap w-full md:w-auto gap-2 flex-1 pl-2">
              <div className="relative flex-1 min-w-[200px] flex items-center">
                <Search className="absolute left-3 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent border-0 focus:ring-0 text-slate-700 placeholder:text-slate-400 outline-none"
                />
              </div>
              
              <div className="h-8 w-px bg-slate-200 my-auto hidden md:block mx-2"></div>
              
              {/* Filter Dropdown */}
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 font-medium cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>

              {/* NEW: Sort Dropdown */}
              <div className="relative flex items-center">
                <ArrowUpDown className="absolute left-3 text-slate-400 pointer-events-none" size={14} />
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-700 font-medium cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            <button 
              onClick={() => setIsFormOpen(true)}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-md shadow-indigo-100 transform active:scale-95 mt-2 md:mt-0"
            >
              <Plus size={20} />
              <span>Create Task</span>
            </button>
          </div>
        )}

        {/* Upgraded Form with distinct borders and Priority */}
        {isFormOpen && (
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
            <form onSubmit={addTodo} className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              
              {/* Form Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">Draft New Task</h2>
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-6 md:p-8 space-y-5">
                
                {/* Title Box */}
                <div>
                  <input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Task Title..." 
                    className="w-full text-lg font-semibold text-slate-800 placeholder:text-slate-400 border border-slate-300 rounded-xl px-4 py-3.5 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all bg-white shadow-sm outline-none"
                    required
                    autoFocus
                  />
                </div>

                {/* Description Box */}
                <div>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a more detailed description..."
                    className="w-full text-slate-600 placeholder:text-slate-400 border border-slate-300 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all resize-none h-24 bg-white shadow-sm outline-none"
                  />
                </div>

                {/* Metadata Row (Grid layout) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50/50 p-5 rounded-xl border border-slate-200">
                  
                  {/* Priority Box */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <Flag size={14} /> Priority
                    </label>
                    <select 
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 shadow-sm transition-all outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  {/* Date Box */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <Calendar size={14} /> Due Date
                    </label>
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 shadow-sm transition-all outline-none"
                    />
                  </div>

                  {/* Tags Box */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <Tag size={14} /> Tags
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. frontend, urgent" 
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 shadow-sm transition-all outline-none"
                    />
                  </div>

                </div>
              </div>

              {/* Form Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 items-center">
                <span className="text-xs text-slate-400 mr-auto hidden sm:flex items-center gap-1">
                  <AlertCircle size={14} /> Press Save to commit to database
                </span>
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all transform active:scale-95"
                >
                  Save Task
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Task Grid using the new filteredAndSortedTodos array */}
        <div className="grid gap-4">
          {filteredAndSortedTodos.map((todo) => (
            <div key={todo.id} className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 flex items-start gap-4">
              
              <button 
                onClick={() => toggleStatus(todo.id, todo.status)}
                className={`mt-1 flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  todo.status === 'completed' 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-200' 
                    : 'border-slate-300 hover:border-indigo-400 text-transparent'
                }`}
              >
                <CheckCircle2 size={16} strokeWidth={3} />
              </button>

              <a href={`/todo.html?id=${todo.id}`} className="flex-1 min-w-0 cursor-pointer block">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <h3 className={`text-lg font-bold truncate transition-colors ${
                      todo.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800 group-hover:text-indigo-600'
                    }`}>
                      {todo.title}
                    </h3>
                    {/* Priority Badge */}
                    {todo.priority && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        todo.status === 'completed' ? 'bg-slate-50 text-slate-400 border-slate-200' : getPriorityColor(todo.priority)
                      }`}>
                        {todo.priority}
                      </span>
                    )}
                  </div>
                  
                  {todo.due_date && (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      todo.status === 'completed' ? 'bg-slate-100 text-slate-400' : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      <Calendar size={12} />
                      {new Date(todo.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>

                {todo.description && (
                  <p className={`mt-2 text-sm truncate ${todo.status === 'completed' ? 'text-slate-300' : 'text-slate-500'}`}>
                    {todo.description}
                  </p>
                )}

                {todo.tags && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {todo.tags.split(',').map((tag, i) => tag.trim() !== "" && (
                      <span key={i} className={`text-xs px-2.5 py-1 rounded-lg font-semibold uppercase tracking-wider ${
                        todo.status === 'completed' ? 'bg-slate-50 text-slate-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors'
                      }`}>
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </a>

              <div className="flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <a href={`/todo.html?id=${todo.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <ChevronRight size={20} />
                </a>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Task"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {filteredAndSortedTodos.length === 0 && !isFormOpen && (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
              <div className="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <LayoutDashboard className="text-indigo-500" size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">No tasks found</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
                {todos.length === 0 
                  ? "Your workspace is clear. Create your first task to get started." 
                  : "We couldn't find any tasks matching your current search or filter."}
              </p>
              {todos.length === 0 && (
                <button 
                  onClick={() => setIsFormOpen(true)}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
                >
                  Create First Task
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}