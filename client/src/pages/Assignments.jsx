import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Assignments() {
  const { user, logout } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [upcomingDueTasks, setUpcomingDueTasks] = useState([]);
  const [uploadModalTask, setUploadModalTask] = useState(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionNote, setSubmissionNote] = useState('');
  const [submittingWork, setSubmittingWork] = useState(false);
  const navigate = useNavigate();

  const fetchAssignments = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/assignments', config);
      setAssignments(data);
    } catch (error) {
      console.error("Failed to fetch assignments", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    if (user.role === 'faculty') {
      navigate('/faculty-dashboard', { replace: true });
      return;
    }
    fetchAssignments();
  }, [user, navigate]);

  // Check due dates and trigger real-time notifications
  useEffect(() => {
    if (!assignments.length) return;
    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const urgent = assignments.filter(a => {
      if (a.status === 'Completed') return false;
      const due = new Date(a.dueDate);
      return due <= twoDaysFromNow;
    });
    setUpcomingDueTasks(urgent);

    // Trigger browser popup notification if urgent tasks exist
    if (urgent.length > 0 && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('🔔 ACEASSIGN Due Date Alert', {
          body: `Reminder: You have ${urgent.length} assignment(s) due very soon (${urgent[0].title})! Please attach & submit your handwritten work.`,
          icon: '/favicon.svg'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('🔔 ACEASSIGN Due Date Alert', {
              body: `Reminder: You have ${urgent.length} assignment(s) due very soon (${urgent[0].title})!`,
              icon: '/favicon.svg'
            });
          }
        });
      }
    }
  }, [assignments]);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/assignments/${id}`, { status: newStatus }, config);
      fetchAssignments();
    } catch (error) {
      console.error("Failed to update assignment", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/assignments/${id}`, config);
      fetchAssignments();
    } catch (error) {
      console.error("Failed to delete assignment", error);
    }
  };

  const handleOpenUploadModal = (assignment) => {
    setUploadModalTask(assignment);
    setSubmissionUrl(assignment.submissionUrl || '');
    setSubmissionNote(assignment.submissionNote || '');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSubmissionUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!uploadModalTask) return;
    setSubmittingWork(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(
        `http://localhost:5000/api/assignments/${uploadModalTask._id}/submit`,
        { submissionUrl, submissionNote, submissionType: 'image' },
        config
      );
      setUploadModalTask(null);
      fetchAssignments();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit handwritten assignment");
    } finally {
      setSubmittingWork(false);
    }
  };

  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full hidden lg:flex flex-col p-md bg-surface border-r border-outline-variant w-[240px] z-50">
        <div className="mb-xl px-sm">
          <h1 className="text-headline-md font-headline-md text-primary font-black tracking-tight">ACEASSIGN</h1>
        </div>
        <nav className="flex-1 space-y-xs">
          <Link to="/dashboard" className="flex items-center gap-md px-md py-sm text-on-secondary-fixed-variant hover:bg-surface-container-high transition-all rounded-lg">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-body-md font-body-md">Dashboard</span>
          </Link>
          <Link to="/assignments" className="flex items-center gap-md px-md py-sm bg-secondary-container text-on-secondary-container font-bold transition-all rounded-lg">
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
      <main className="flex-1 lg:ml-[240px] flex flex-col min-w-0 p-lg lg:p-xl max-w-7xl mx-auto w-full animate-fade-in">
        {/* Real-Time Due Date Notification Banner */}
        {upcomingDueTasks.length > 0 && (
          <div className="bg-gradient-to-r from-rose-500/15 via-amber-500/15 to-indigo-500/15 border border-rose-300 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/25 shrink-0">
                <span className="material-symbols-outlined text-[24px] animate-bounce">notifications_active</span>
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <span>ACEASSIGN DUE DATE ALERT ENGINE</span>
                  <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                    Urgent ({upcomingDueTasks.length})
                  </span>
                </h4>
                <p className="text-xs text-slate-700 font-medium mt-0.5">
                  You have assignment(s) due right now or within 48 hours: <strong className="text-rose-700 font-black">{upcomingDueTasks.map(t => `${t.title} (${new Date(t.dueDate).toLocaleDateString()})`).join(', ')}</strong>. Please click &quot;Upload Work&quot; to attach your handwritten notes!
                </p>
              </div>
            </div>
            <button
              onClick={() => setViewMode('calendar')}
              className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all shrink-0 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_month</span> Check Calendar
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs tracking-wide uppercase mb-1 border border-indigo-100">
              <span className="material-symbols-outlined text-[14px]">school</span> Assigned Coursework
            </div>
            <h2 className="font-headline-lg text-3xl font-extrabold tracking-tight text-slate-800">Your Assignments</h2>
            <p className="text-xs text-slate-500 mt-0.5">Complete tasks assigned by your professors and submit handwritten homework scans</p>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <span className="material-symbols-outlined text-[18px]">list_alt</span> Table View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${viewMode === 'calendar' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span> Due Date Calendar
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <>
            {/* Search and Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-indigo-50/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1 group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors text-[20px]">search</span>
                <input 
                  type="text" 
                  placeholder="Search tasks by title, keyword or subject..." 
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="relative w-full md:w-56 shrink-0">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">filter_list</span>
                <select 
                  className="w-full pl-10 pr-8 py-3 border border-slate-200 rounded-xl bg-slate-50/50 text-sm font-bold text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 appearance-none cursor-pointer"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">expand_more</span>
              </div>
            </div>

            {/* Premium Table Card */}
            <div className="bg-white rounded-3xl border border-indigo-50/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100/80">
                      <th className="p-4 pl-6 text-xs font-bold uppercase tracking-wider text-slate-400 w-16">Status</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Assignment Title</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Subject</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Due Date</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Priority</th>
                      <th className="p-4 pr-6 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan="6" className="p-12 text-center text-slate-400 font-medium">Loading your assignments...</td></tr>
                    ) : filteredAssignments.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-12 text-center">
                          <div className="max-w-xs mx-auto py-6">
                            <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">folder_open</span>
                            <p className="text-slate-700 font-bold text-base">No tasks assigned yet</p>
                            <p className="text-slate-400 text-xs mt-1">When your professors assign coursework, they will automatically appear here!</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredAssignments.map(a => (
                        <tr key={a._id} className="hover:bg-indigo-50/30 transition-all duration-200 group">
                          <td className="p-4 pl-6">
                            <button 
                              onClick={() => handleStatusChange(a._id, a.status)} 
                              className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${a.status === 'Completed' ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-500 shadow-sm' : 'border-slate-300 hover:border-indigo-500 bg-white'}`}
                              title="Toggle Completion"
                            >
                              {a.status === 'Completed' && <span className="material-symbols-outlined text-[16px] text-white font-bold">check</span>}
                            </button>
                          </td>
                          <td className="p-4">
                            <p className={`font-bold text-sm text-slate-800 transition-colors ${a.status === 'Completed' ? 'line-through text-slate-400 font-medium' : 'group-hover:text-indigo-600'}`}>
                              {a.title}
                            </p>
                          </td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-indigo-50/80 text-indigo-700 font-bold text-xs rounded-xl inline-block border border-indigo-100/50">
                              {a.subject}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`text-xs font-semibold flex items-center gap-1.5 ${a.status === 'Overdue' ? 'text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-lg inline-flex' : 'text-slate-600'}`}>
                              <span className="material-symbols-outlined text-[15px]">calendar_today</span>
                              {new Date(a.dueDate).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 text-xs font-extrabold rounded-full tracking-wide inline-block ${a.priority === 'High' ? 'bg-rose-100 text-rose-700' : a.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {a.priority}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right whitespace-nowrap">
                            {a.grade && (
                              <span className="mr-2 px-2.5 py-1 bg-purple-100 text-purple-700 font-black text-xs rounded-lg inline-block shadow-sm">
                                Grade: {a.grade}
                              </span>
                            )}
                            <button
                              onClick={() => handleOpenUploadModal(a)}
                              className={`mr-2 px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                                a.submissionUrl
                                  ? 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 shadow-sm'
                                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                              }`}
                              title="Upload / View Handwritten Work"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                {a.submissionUrl ? 'verified' : 'upload_file'}
                              </span>
                              {a.submissionUrl ? 'View Work' : 'Upload Work'}
                            </button>
                            <button 
                              onClick={() => handleDelete(a._id)} 
                              className="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all inline-flex items-center justify-center"
                              title="Delete Task"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Monthly Interactive Calendar View */
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
              <div>
                <h3 className="font-headline-lg text-xl font-black text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600">event_available</span>
                  {currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' })} Due Date Calendar
                </h3>
                <p className="text-xs text-slate-400 font-medium">Click on any task inside a day cell to upload your handwritten assignment scan</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1))}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                  title="Previous Month"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  onClick={() => setCurrentMonthDate(new Date())}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-extrabold transition-colors"
                >
                  Current Month
                </button>
                <button
                  onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1))}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                  title="Next Month"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-black uppercase text-slate-400 tracking-wider">
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>

            {/* Calendar Grid Cells */}
            <div className="grid grid-cols-7 gap-2">
              {(() => {
                const year = currentMonthDate.getFullYear();
                const month = currentMonthDate.getMonth();
                const firstDayOfWeek = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const cells = [];

                // Empty slots before first day
                for (let i = 0; i < firstDayOfWeek; i++) {
                  cells.push(<div key={`empty-${i}`} className="min-h-[105px] bg-slate-50/40 rounded-2xl border border-slate-100/60 p-2 opacity-50"></div>);
                }

                // Days 1..daysInMonth
                for (let day = 1; day <= daysInMonth; day++) {
                  const cellDate = new Date(year, month, day);
                  const isToday = cellDate.toDateString() === new Date().toDateString();
                  const dayAssignments = filteredAssignments.filter(a => {
                    const due = new Date(a.dueDate);
                    return due.getFullYear() === year && due.getMonth() === month && due.getDate() === day;
                  });

                  cells.push(
                    <div
                      key={day}
                      className={`min-h-[110px] rounded-2xl border p-2.5 transition-all flex flex-col ${
                        isToday
                          ? 'bg-indigo-50/40 border-indigo-500/60 shadow-sm'
                          : dayAssignments.length > 0
                          ? 'bg-purple-50/25 border-purple-200 hover:border-purple-300'
                          : 'bg-white border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                          isToday ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 bg-slate-100'
                        }`}>
                          {day}
                        </span>
                        {dayAssignments.length > 0 && (
                          <span className="text-[10px] font-extrabold bg-rose-500 text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs animate-pulse">
                            <span className="material-symbols-outlined text-[11px]">notifications</span> {dayAssignments.length} Due
                          </span>
                        )}
                      </div>

                      <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[85px] pr-0.5">
                        {dayAssignments.map(task => (
                          <div
                            key={task._id}
                            onClick={() => handleOpenUploadModal(task)}
                            className={`p-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all border shadow-2xs flex flex-col ${
                              task.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                : task.status === 'Overdue'
                                ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 animate-pulse'
                                : 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100'
                            }`}
                            title={`Click to view/upload work for: ${task.title}`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="truncate">{task.title}</span>
                              <span className="material-symbols-outlined text-[13px] shrink-0">
                                {task.submissionUrl ? 'verified' : 'upload_file'}
                              </span>
                            </div>
                            <div className="text-[9px] text-slate-500 truncate mt-0.5">{task.subject}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return cells;
              })()}
            </div>
          </div>
        )}

        {/* Handwritten Assignment Upload & Review Modal */}
        {uploadModalTask && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
            <div className="bg-white p-7 md:p-8 rounded-3xl w-full max-w-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 relative overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">upload_file</span>
                  </div>
                  <div>
                    <h3 className="font-headline-lg text-xl font-extrabold text-slate-800 tracking-tight">Handwritten Assignment Work</h3>
                    <p className="text-xs text-slate-400 font-medium">{uploadModalTask.title}</p>
                  </div>
                </div>
                <button onClick={() => setUploadModalTask(null)} className="w-8 h-8 rounded-full text-slate-400 hover:bg-slate-100 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Faculty Grade / Feedback Banner if Graded */}
              {(uploadModalTask.grade || uploadModalTask.facultyFeedback) && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">verified</span> Faculty Grade & Evaluation
                    </span>
                    {uploadModalTask.grade && (
                      <span className="bg-purple-600 text-white font-black text-sm px-3 py-1 rounded-xl shadow-sm">
                        Grade: {uploadModalTask.grade}
                      </span>
                    )}
                  </div>
                  {uploadModalTask.facultyFeedback && (
                    <p className="text-xs text-slate-700 font-medium bg-white/80 p-3 rounded-xl border border-purple-100">
                      &quot;{uploadModalTask.facultyFeedback}&quot;
                    </p>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmitWork} className="space-y-5">
                {/* Upload Section */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Upload Scan / Photo of Handwritten Assignment</label>
                  
                  <div className="border-2 border-dashed border-slate-200 hover:border-purple-400 rounded-2xl p-6 text-center transition-all bg-slate-50/50 relative">
                    {submissionUrl ? (
                      <div className="space-y-3">
                        {submissionUrl.startsWith('data:image') || submissionUrl.match(/\.(jpeg|jpg|gif|png|webp)/i) ? (
                          <div className="max-h-60 rounded-xl overflow-hidden border border-slate-200 mx-auto flex items-center justify-center bg-white">
                            <img src={submissionUrl} alt="Handwritten Preview" className="max-h-60 w-auto object-contain" />
                          </div>
                        ) : (
                          <div className="p-3 bg-purple-50 rounded-xl text-xs text-purple-700 font-bold break-all">
                            {submissionUrl}
                          </div>
                        )}
                        <label className="cursor-pointer inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800 bg-white px-3 py-1.5 rounded-lg border border-purple-200 shadow-sm">
                          <span className="material-symbols-outlined text-[16px]">change_circle</span> Change Photo / File
                          <input type="file" accept="image/*,.pdf" onChange={handleFileSelect} className="hidden" />
                        </label>
                      </div>
                    ) : (
                      <label className="cursor-pointer block space-y-2 py-4">
                        <span className="material-symbols-outlined text-4xl text-purple-400 block">add_photo_alternate</span>
                        <span className="text-sm font-bold text-slate-700 block">Click to select photo / scan of your handwritten work</span>
                        <span className="text-xs text-slate-400 block">Supports JPG, PNG, WEBP images</span>
                        <input type="file" accept="image/*,.pdf" onChange={handleFileSelect} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                {/* Or enter Direct Link */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Or Paste Cloud File URL (Google Drive / OneDrive Link)</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={submissionUrl.startsWith('data:') ? '' : submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 text-sm font-medium"
                  />
                </div>

                {/* Submission Notes */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Student Notes for Faculty (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Add any comments about your solution or steps taken..."
                    value={submissionNote}
                    onChange={(e) => setSubmissionNote(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 text-sm font-medium resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setUploadModalTask(null)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingWork}
                    className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    {submittingWork ? <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> : <span className="material-symbols-outlined text-[16px]">cloud_upload</span>}
                    Submit Handwritten Work
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Assignments;
