import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Trash2, CalendarDays, Edit3 } from 'lucide-react';

export default function SingleTodo() {
  const [todo, setTodo] = useState(null);
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (id) {
      fetch(`${API_URL}/api/todos/${id}`)
        .then(res => res.json())
        .then(data => setTodo(data));
    }
  }, [id]);

  const handleComplete = async () => {
    const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
    await fetch(`${API_URL}/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    setTodo({ ...todo, status: newStatus });
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task forever?")) return;
    await fetch(`${API_URL}/api/todos/${id}`, { method: 'DELETE' });
    window.location.href = '/index.html'; 
  };

  if (!todo) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-indigo-600 font-medium">Loading details...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        
        <a href="/index.html" className="group inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 font-medium">
          <ArrowLeft size={20} className="transform group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </a>
        
        <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_rgb(0,0,0,0.05)] overflow-hidden">
          
          <div className="p-10 border-b border-slate-100">
            <div className="flex flex-wrap justify-between items-start gap-6 mb-6">
              <h1 className={`text-4xl font-extrabold tracking-tight flex-1 ${todo.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                {todo.title}
              </h1>
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${
                todo.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {todo.status === 'completed' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                {todo.status.toUpperCase()}
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-slate-500 font-medium bg-slate-50 inline-block px-5 py-2.5 rounded-xl">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} className="text-indigo-400" />
                Created {new Date(todo.created_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
          
          <div className="p-10 bg-slate-50/50">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
              <Edit3 size={16} />
              Task Description
            </h3>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[150px]">
              <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                {todo.description || <span className="text-slate-400 italic">No additional details provided.</span>}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-10 mt-10 border-t border-slate-200">
              <button 
                onClick={handleComplete}
                className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold transition-all ${
                  todo.status === 'completed' 
                    ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-1'
                }`}
              >
                <CheckCircle2 size={24} />
                {todo.status === 'completed' ? 'Mark as Pending' : 'Complete Task'}
              </button>
              
              <button 
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-red-100 text-red-500 rounded-xl font-bold hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer"
              >
                <Trash2 size={20} />
                Delete
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}