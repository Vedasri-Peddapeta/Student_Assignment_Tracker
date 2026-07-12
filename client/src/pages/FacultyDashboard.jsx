import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function FacultyDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentAssignments, setStudentAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  // Assign Task modal state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState('all'); // 'all' or specific studentId
  const [newTask, setNewTask] = useState({ title: '', subject: '', priority: 'Medium', dueDate: '', estimatedHours: '' });
  const [assigning, setAssigning] = useState(false);

  // Review & Grade modal state
  const [reviewModalTask, setReviewModalTask] = useState(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [savingGrade, setSavingGrade] = useState(false);

  const token = user?.token || JSON.parse(localStorage.getItem('userInfo') || '{}')?.token;

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (user && user.role !== 'faculty') {
      navigate('/dashboard', { replace: true });
      return;
    }
    fetchStudents();
  }, [token, user]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/faculty/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    setLoadingAssignments(true);
    try {
      const { data } = await axios.get(`http://localhost:5000/api/faculty/students/${student._id}/assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudentAssignments(data.assignments || []);
    } catch (error) {
      console.error('Error fetching student assignments:', error);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const handleOpenAssignModal = (target = 'all') => {
    setAssignTarget(target);
    setNewTask({ title: '', subject: '', priority: 'Medium', dueDate: '', estimatedHours: '' });
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setAssigning(true);
    try {
      await axios.post(
        `http://localhost:5000/api/faculty/students/${assignTarget}/assignments`,
        newTask,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsAssignModalOpen(false);
      fetchStudents();
      if (selectedStudent && assignTarget === selectedStudent._id) {
        handleSelectStudent(selectedStudent);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to assign task');
    } finally {
      setAssigning(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assigned task?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/faculty/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudentAssignments(prev => prev.filter(a => a._id !== assignmentId));
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleOpenReview = (assignment) => {
    setReviewModalTask(assignment);
    setGradeInput(assignment.grade || '');
    setFeedbackInput(assignment.facultyFeedback || '');
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!reviewModalTask) return;
    setSavingGrade(true);
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/faculty/assignments/${reviewModalTask._id}/grade`,
        { grade: gradeInput, facultyFeedback: feedbackInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudentAssignments(prev => prev.map(a => a._id === data._id ? data : a));
      setReviewModalTask(null);
      fetchStudents();
    } catch (error) {
      console.error('Error saving grade:', error);
      alert('Failed to save grade');
    } finally {
      setSavingGrade(false);
    }
  };

  // Calculate high level metrics
  const totalStudents = students.length;
  const totalSubmissions = students.reduce((acc, s) => acc + (s.stats?.submissions || 0), 0);
  const avgCompletion = totalStudents === 0 ? 0 : Math.round(
    students.reduce((acc, s) => acc + (s.stats?.progress || 0), 0) / totalStudents
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
      {/* Top Faculty Navigation Bar */}
      <header className="bg-slate-900/80 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <span className="material-symbols-outlined text-white text-[22px]">supervisor_account</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              ACEASSIGN <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text text-xs uppercase px-2 py-0.5 rounded-full border border-purple-500/30">Faculty Portal</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Assign Tasks to Students & Grade Handwritten Submissions</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleOpenAssignModal('all')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-lg shadow-indigo-500/25 flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_task</span> Assign Task to All Students
          </button>
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs text-slate-300">
            <span className="material-symbols-outlined text-purple-400 text-[18px]">verified_user</span>
            <span>Prof. {user?.name || 'Faculty Member'}</span>
          </div>
          <button
            onClick={logout}
            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span> Sign out
          </button>
        </div>
      </header>

      {/* Main Faculty Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {/* Faculty Profile Badge Box */}
        <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900/90 border border-indigo-500/30 rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'F'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-indigo-500/30">
                  Faculty Account Profile
                </span>
                <span className="text-xs text-slate-400 font-medium">| Authorized Instructor</span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">Prof. {user?.name || 'Faculty Member'}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email || 'Instructor Command Center'}</p>
            </div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-right">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Portal Access Status</span>
            <span className="text-sm font-black text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Active Faculty Command Center
            </span>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Enrolled Students Roster</span>
              <span className="material-symbols-outlined text-indigo-400">groups</span>
            </div>
            <div className="text-4xl font-black text-white">{totalStudents}</div>
            <p className="text-xs text-slate-500 mt-1">Active student profiles across your courses</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/50 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Submissions</span>
              <span className="material-symbols-outlined text-purple-400">rate_review</span>
            </div>
            <div className="text-4xl font-black text-white">{totalSubmissions}</div>
            <p className="text-xs text-slate-500 mt-1">Handwritten tasks uploaded & awaiting review</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Class Progress Rate</span>
              <span className="material-symbols-outlined text-emerald-400">trending_up</span>
            </div>
            <div className="text-4xl font-black text-emerald-400">{avgCompletion}%</div>
            <p className="text-xs text-slate-500 mt-1">Average task completion rate across students</p>
          </div>
        </div>

        {/* Student Grid and Drilldown Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Class Roster & Enrolled Students (Col 5) */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400">groups</span>
                  Class Roster: Enrolled Students ({students.length})
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Select a student below to assign or review work</p>
              </div>
              <button
                onClick={fetchStudents}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span> Refresh
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-3xl mb-2 text-indigo-500">progress_activity</span>
                <span>Loading student profiles...</span>
              </div>
            ) : students.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
                <p>No student profiles registered yet.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {students.map((student) => {
                  const isSelected = selectedStudent?._id === student._id;
                  const st = student.stats || {};
                  return (
                    <div
                      key={student._id}
                      onClick={() => handleSelectStudent(student)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-white text-sm flex items-center gap-2">
                            {student.name}
                            {st.submissions > 0 && (
                              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">upload_file</span>
                                {st.submissions} submissions
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-slate-400">{student.email}</p>
                        </div>
                        <span className="text-xs font-black px-2 py-1 rounded-lg bg-slate-800 text-indigo-300">
                          {st.progress}%
                        </span>
                      </div>

                      {/* Mini Progress Bar */}
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
                          style={{ width: `${st.progress}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Assigned: <strong className="text-white">{st.total}</strong></span>
                        <span>Done: <strong className="text-emerald-400">{st.completed}</strong></span>
                        <span>Pending: <strong className="text-amber-400">{st.pending}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Selected Student Assignments & Faculty Actions (Col 7) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 min-h-[660px] flex flex-col">
            {selectedStudent ? (
              <div className="flex-1 flex flex-col space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                      {selectedStudent.name}&apos;s Assigned Work
                    </h2>
                    <p className="text-xs text-slate-400">{selectedStudent.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenAssignModal(selectedStudent._id)}
                      className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span> Assign New Task
                    </button>
                    <button
                      onClick={() => setSelectedStudent(null)}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl border border-slate-700 transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back
                    </button>
                  </div>
                </div>

                {loadingAssignments ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-20">
                    <span className="material-symbols-outlined animate-spin text-3xl mb-2 text-indigo-500">progress_activity</span>
                    <span>Fetching student tasks & submissions...</span>
                  </div>
                ) : studentAssignments.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800 p-8 text-center">
                    <span className="material-symbols-outlined text-4xl mb-2 text-slate-600">assignment_turned_in</span>
                    <p className="font-bold text-slate-400">No tasks assigned to {selectedStudent.name} yet</p>
                    <p className="text-xs text-slate-600 mt-1">Click &quot;Assign New Task&quot; above to give this student coursework or homework.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
                    {studentAssignments.map((task) => {
                      const hasUpload = !!task.submissionUrl;
                      return (
                        <div
                          key={task._id}
                          className="bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                                {task.subject}
                              </span>
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                task.status === 'Overdue' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse' :
                                'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                Student Status: {task.status}
                              </span>
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                              {task.grade && (
                                <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                                  Assigned Grade: {task.grade}
                                </span>
                              )}
                            </div>
                            <h3 className="font-extrabold text-white text-base">{task.title}</h3>
                            {task.description && <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>}
                            
                            {hasUpload ? (
                              <div className="flex items-center gap-2 pt-1 text-xs text-purple-300 font-semibold bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20 w-fit">
                                <span className="material-symbols-outlined text-[16px] text-purple-400">check_circle</span>
                                <span>Student Uploaded Handwritten Work!</span>
                                {task.submittedAt && <span className="text-slate-400 text-[10px]">({new Date(task.submittedAt).toLocaleDateString()})</span>}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 pt-1 text-xs text-amber-400/80 font-medium">
                                <span className="material-symbols-outlined text-[16px]">schedule</span>
                                <span>Awaiting student submission upload...</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleOpenReview(task)}
                              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                                hasUpload
                                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/20'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                {hasUpload ? 'rate_review' : 'visibility'}
                              </span>
                              {hasUpload ? 'Review & Grade Work' : 'Inspect Task / Grade'}
                            </button>
                            <button
                              onClick={() => handleDeleteAssignment(task._id)}
                              className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 flex items-center justify-center transition-colors"
                              title="Delete Assigned Task"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
                  <span className="material-symbols-outlined text-3xl">touch_app</span>
                </div>
                <h3 className="text-base font-bold text-white">Select a Student to Assign or Review Work</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Click on any student from the roster on the left to assign new coursework, inspect their uploaded handwritten files, and assign grades.
                </p>
                <button
                  onClick={() => handleOpenAssignModal('all')}
                  className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">add_task</span> Assign Task to Entire Class
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Assign Task Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Faculty Course Management</span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  {assignTarget === 'all' ? 'Assign Task to Entire Class' : `Assign Task to ${selectedStudent?.name}`}
                </h3>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Target Students</label>
                <select
                  value={assignTarget}
                  onChange={(e) => setAssignTarget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm font-bold text-indigo-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">Assign to All Enrolled Students ({totalStudents})</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>Assign ONLY to {s.name} ({s.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Calculus Problem Set 5"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Course / Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MATH 101"
                    value={newTask.subject}
                    onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Est. Hours</label>
                  <input
                    type="number"
                    placeholder="e.g. 3"
                    value={newTask.estimatedHours}
                    onChange={(e) => setNewTask({ ...newTask, estimatedHours: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Instructions / Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Provide any guidelines or reference chapters..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigning}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-2.5 rounded-xl text-xs font-extrabold shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-1.5"
                >
                  {assigning ? <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> : <span className="material-symbols-outlined text-[16px]">send</span>}
                  Confirm & Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review & Grade Modal */}
      {reviewModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Faculty Inspection & Grading</span>
                <h3 className="text-lg font-black text-white mt-0.5">{reviewModalTask.title}</h3>
              </div>
              <button
                onClick={() => setReviewModalTask(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Handwritten Preview Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-purple-400">upload_file</span>
                Student Handwritten Submission Preview
              </h4>
              
              {reviewModalTask.submissionUrl ? (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  {reviewModalTask.submissionUrl.startsWith('data:image') || reviewModalTask.submissionUrl.match(/\.(jpeg|jpg|gif|png|webp)/i) ? (
                    <div className="rounded-lg overflow-hidden border border-slate-800 max-h-80 flex items-center justify-center bg-slate-900">
                      <img
                        src={reviewModalTask.submissionUrl}
                        alt="Handwritten Submission"
                        className="max-h-80 w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-900 rounded-lg text-xs text-indigo-300 break-all border border-slate-800 flex items-center gap-2">
                      <span className="material-symbols-outlined text-purple-400">link</span>
                      <a href={reviewModalTask.submissionUrl} target="_blank" rel="noreferrer" className="underline hover:text-white">
                        {reviewModalTask.submissionUrl}
                      </a>
                    </div>
                  )}

                  {reviewModalTask.submissionNote && (
                    <div className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <strong className="text-slate-400 block mb-1">Student Note:</strong>
                      {reviewModalTask.submissionNote}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 bg-slate-950 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-xs">
                  <span className="material-symbols-outlined text-2xl mb-1 block text-slate-600">hide_image</span>
                  This student has not yet uploaded a handwritten submission file for this task.
                </div>
              )}
            </div>

            {/* Grading Form */}
            <form onSubmit={handleSaveGrade} className="space-y-4 border-t border-slate-800 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Grade / Score</label>
                  <input
                    type="text"
                    placeholder="e.g. A+ or 10/10"
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Faculty Feedback / Review Notes</label>
                  <input
                    type="text"
                    placeholder="Provide constructive feedback on neatness and accuracy..."
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalTask(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingGrade}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-2 rounded-xl text-xs font-extrabold shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-1.5"
                >
                  {savingGrade ? <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> : <span className="material-symbols-outlined text-[16px]">check_circle</span>}
                  Save Faculty Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
