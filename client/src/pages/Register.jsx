import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Register() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'faculty') {
        navigate('/faculty-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    try {
      await register(fullname, email, password, role);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-md bg-background">
      <main className="w-full max-w-[480px] animate-fade-in">
        <div className="flex flex-col items-center mb-xl">
          <span className="font-headline-lg text-headline-lg text-primary tracking-tight mb-xs font-black">ACEASSIGN</span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-xs">
            {role === 'faculty' ? 'Create Faculty Account' : 'Create Student Account'}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {role === 'faculty' ? 'Set up your portal to review student progress' : 'Start organizing your academic journey today'}
          </p>
        </div>
        
        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl mb-6 border border-slate-200">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${role === 'student' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <span className="material-symbols-outlined text-[18px]">school</span> Student Account
          </button>
          <button
            type="button"
            onClick={() => setRole('faculty')}
            className={`py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${role === 'faculty' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <span className="material-symbols-outlined text-[18px]">supervisor_account</span> Faculty Account
          </button>
        </div>

        {error && <div className="mb-4 text-error text-sm font-bold bg-error-container p-3 rounded-lg">{error}</div>}

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.03)] p-lg md:p-xl">
          <form className="space-y-lg" onSubmit={handleSubmit}>
            <div className="space-y-sm">
              <label className="font-label-sm text-label-sm text-on-surface-variant block" htmlFor="fullname">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant">person</span>
                <input 
                  className="w-full pl-xl pr-md py-md bg-transparent border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface outline-none focus:border-primary-container focus:ring-2 focus:ring-primary/20 transition-all" 
                  id="fullname" 
                  placeholder="Alex Rivers" 
                  required 
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-sm">
              <label className="font-label-sm text-label-sm text-on-surface-variant block" htmlFor="email">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant">mail</span>
                <input 
                  className="w-full pl-xl pr-md py-md bg-transparent border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface outline-none focus:border-primary-container focus:ring-2 focus:ring-primary/20 transition-all" 
                  id="email" 
                  placeholder="alex.rivers@university.edu" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="space-y-sm">
                <label className="font-label-sm text-label-sm text-on-surface-variant block" htmlFor="password">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant">lock</span>
                  <input 
                    className="w-full pl-xl pr-md py-md bg-transparent border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface outline-none focus:border-primary-container focus:ring-2 focus:ring-primary/20 transition-all" 
                    id="password" 
                    placeholder="••••••••" 
                    required 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-sm">
                <label className="font-label-sm text-label-sm text-on-surface-variant block" htmlFor="confirm_password">Confirm Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant">shield_lock</span>
                  <input 
                    className="w-full pl-xl pr-md py-md bg-transparent border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface outline-none focus:border-primary-container focus:ring-2 focus:ring-primary/20 transition-all" 
                    id="confirm_password" 
                    placeholder="••••••••" 
                    required 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button 
              className="w-full bg-primary-container hover:bg-primary-container/90 text-on-primary font-button text-button py-md rounded-lg shadow-sm active:scale-[0.98] transition-all flex justify-center items-center gap-sm" 
              type="submit"
              disabled={loading}
            >
              {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : 'Create Account'}
            </button>
          </form>
        </div>
        <div className="mt-lg text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Already have an account? <Link to="/" className="text-primary font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Register;
