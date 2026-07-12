import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    if (user.role === 'faculty') {
      navigate('/faculty-dashboard', { replace: true });
      return;
    }

    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/dashboard', config);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
      setLoading(false);
    };

    fetchStats();
  }, [user, navigate]);

  if (!user || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full hidden lg:flex flex-col p-md bg-surface border-r border-outline-variant w-[240px] z-50">
        <div className="mb-xl px-sm">
          <h1 className="text-headline-md font-headline-md text-primary font-black tracking-tight">ACEASSIGN</h1>
        </div>
        <div className="flex items-center gap-md px-sm mb-xl">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-body-md truncate text-on-surface">{user.name}</p>
            <p className="text-xs text-on-surface-variant truncate">Student</p>
          </div>
        </div>
        <nav className="flex-1 space-y-xs">
          <Link to="/dashboard" className="flex items-center gap-md px-md py-sm bg-secondary-container text-on-secondary-container font-bold rounded-lg transition-all">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-body-md font-body-md">Dashboard</span>
          </Link>
          <Link to="/assignments" className="flex items-center gap-md px-md py-sm text-on-secondary-fixed-variant hover:bg-surface-container-high transition-all rounded-lg">
            <span className="material-symbols-outlined">assignment</span>
            <span className="text-body-md font-body-md">Assignments</span>
          </Link>
          <button onClick={logout} className="w-full mt-4 flex items-center gap-md px-md py-sm text-error hover:bg-error/10 transition-all rounded-lg">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-body-md font-body-md">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[240px] flex flex-col min-w-0">
        <header className="flex justify-between items-center px-lg py-md w-full sticky top-0 z-50 bg-surface shadow-sm h-16">
          <div className="flex items-center gap-lg flex-1">
            <button className="material-symbols-outlined text-primary lg:hidden">menu</button>
            <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">
              Student Dashboard
            </span>
          </div>
        </header>
        
        <div className="p-lg lg:p-xl max-w-7xl mx-auto w-full space-y-xl animate-fade-in">
          {/* Hero Greeting Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.25)] relative overflow-hidden border border-white/10">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 right-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase border border-white/20 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Academic Semester Tracker
                </div>
                <h2 className="font-headline-lg text-3xl md:text-4xl font-extrabold tracking-tight">
                  Welcome back, {user.name.split(' ')[0]}! ✨
                </h2>
                <p className="text-blue-100 font-body-md text-base md:text-lg opacity-90 leading-relaxed">
                  You currently have <span className="text-white font-bold underline decoration-amber-400 decoration-2 underline-offset-4">{stats?.pending || 0} pending assignments</span> requiring your attention. Let's make today productive!
                </p>
              </div>
              <Link
                to="/assignments"
                className="bg-white text-indigo-700 hover:bg-blue-50 font-bold px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 text-sm shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">task_alt</span>
                View All Assignments
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-lg">
            <div className="col-span-12 xl:col-span-8 space-y-lg">
              {/* Premium Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-md">
                {/* Total Card */}
                <div className="bg-white p-6 rounded-2xl border border-indigo-50/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.12)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center justify-between mb-4 gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tasks</span>
                    <div className="w-10 h-10 shrink-0 overflow-hidden rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <span className="material-symbols-outlined text-[20px] select-none">list_alt</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{stats?.total || 0}</h3>
                    <span className="text-xs text-slate-500 font-medium">recorded</span>
                  </div>
                </div>

                {/* Pending Card */}
                <div className="bg-white p-6 rounded-2xl border border-amber-50/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(245,158,11,0.12)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center justify-between mb-4 gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending</span>
                    <div className="w-10 h-10 shrink-0 overflow-hidden rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <span className="material-symbols-outlined text-[20px] select-none">pending_actions</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{stats?.pending || 0}</h3>
                    <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">in progress</span>
                  </div>
                </div>

                {/* Overdue Card */}
                <div className="bg-white p-6 rounded-2xl border border-rose-50/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(244,63,94,0.15)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-red-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center justify-between mb-4 gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overdue</span>
                    <div className="w-10 h-10 shrink-0 overflow-hidden rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <span className="material-symbols-outlined text-[20px] select-none">priority_high</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-extrabold text-rose-600 tracking-tight">{stats?.overdue || 0}</h3>
                    {stats?.overdue > 0 && <span className="text-xs text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full animate-pulse">urgent</span>}
                  </div>
                </div>

                {/* Done Card */}
                <div className="bg-white p-6 rounded-2xl border border-emerald-50/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(16,185,129,0.12)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center justify-between mb-4 gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed</span>
                    <div className="w-10 h-10 shrink-0 overflow-hidden rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <span className="material-symbols-outlined text-[20px] select-none">check_circle</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{stats?.completed || 0}</h3>
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">finished</span>
                  </div>
                </div>
              </div>

              {/* Sleek Recent Tasks Card */}
              <div className="bg-white rounded-3xl border border-indigo-50/80 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 tracking-tight">Recent Assignments</h4>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Your latest academic activities and deadlines</p>
                  </div>
                  <Link to="/assignments" className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors flex items-center gap-1">
                    Manage All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {stats?.recentAssignments?.length > 0 ? stats.recentAssignments.map((task) => (
                    <div key={task._id} className="group flex items-center justify-between p-4 bg-slate-50/60 hover:bg-indigo-50/40 border border-slate-100 hover:border-indigo-200 rounded-2xl transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${task.status === 'Completed' ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' : 'bg-white border-2 border-slate-200 text-transparent'}`}>
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        </div>
                        <div>
                          <p className={`font-bold text-sm text-slate-800 transition-colors ${task.status === 'Completed' ? 'line-through text-slate-400' : 'group-hover:text-indigo-600'}`}>{task.title}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100/70 text-indigo-700 font-bold text-[11px] tracking-tight">{task.subject}</span>
                            <span className={`text-[12px] flex items-center gap-1 font-medium ${task.status === 'Overdue' ? 'text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md' : 'text-slate-500'}`}>
                              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold ${task.priority === 'High' ? 'bg-rose-100 text-rose-700' : task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">task_alt</span>
                      <p className="text-slate-600 font-bold text-sm">No assignments recorded yet</p>
                      <p className="text-slate-400 text-xs mt-1">Click "View All Assignments" or "+ New Task" to get started!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Premium Right Panel Summary Card */}
            <div className="col-span-12 xl:col-span-4 space-y-lg">
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-7 md:p-8 rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.4)] border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div>
                      <h4 className="text-xl font-extrabold tracking-tight">Academic Pulse</h4>
                      <p className="text-xs text-indigo-300 font-medium mt-0.5">Real-time completion metrics</p>
                    </div>
                    <span className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-indigo-300">
                      <span className="material-symbols-outlined text-[22px]">analytics</span>
                    </span>
                  </div>

                  {/* Circular / Progress Highlight */}
                  <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-xs uppercase tracking-wider text-indigo-200 font-bold">Overall Progress</span>
                      <span className="text-3xl font-black text-white">{stats?.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
                      <div 
                        className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(56,189,248,0.5)]" 
                        style={{ width: `${stats?.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Summary Breakdown */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center px-4 py-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                        <span className="text-sm text-slate-300 font-medium">High Priority</span>
                      </div>
                      <span className="font-extrabold text-white bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-lg text-xs">{stats?.highPriority || 0} tasks</span>
                    </div>

                    <div className="flex justify-between items-center px-4 py-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span className="text-sm text-slate-300 font-medium">Pending Tasks</span>
                      </div>
                      <span className="font-extrabold text-white bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-lg text-xs">{stats?.pending || 0} tasks</span>
                    </div>

                    <div className="flex justify-between items-center px-4 py-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="text-sm text-slate-300 font-medium">Completed</span>
                      </div>
                      <span className="font-extrabold text-white bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-lg text-xs">{stats?.completed || 0} tasks</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link to="/assignments" className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-[18px]">add_circle</span>
                      Create New Assignment
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
