import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, user } = useContext(AuthContext);
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
    setLoading(true);
    try {
      await login(email, password, role);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center p-md">
      <main className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.03)] border border-outline-variant overflow-hidden animate-fade-in">
        <section className="order-1 lg:order-2 bg-surface-container-low flex items-center justify-center p-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary-container rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-fixed rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 w-full max-w-[480px]">
            <img className="w-full h-auto object-contain drop-shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFIOD8DfVjrTazBGD4S-L0wi4J8ndNQoXU8m_PzwiryPMI5SiVdreqkHOTvJq6o1hynLmUtLrvjLciPlzN5RJWxoRLejVbz0lDFN0atuCduS8Pztn6-wGs4wnKql5Gy0lRP96IAN7o7DIabAH8uLFmRgpvPZbnnwrxT3HyyTkTJ_EPJN4rXNu0Tt-t_l-eGFzoRZVddgyc8Eo4-ubCAMen9yTcepc_e6036pzfZ4WFQ0il7eKBBBBYGd1H4hY5gKbDGkfgDoAH5k4" alt="Illustration" />
          </div>
        </section>
        <section className="order-2 lg:order-1 flex flex-col justify-center p-lg md:p-xl">
          <header className="mb-lg animate-fade-in delay-100">
            <div className="flex items-center gap-sm mb-md">
              <span className="font-headline-md text-headline-md text-primary tracking-tight font-black">ACEASSIGN</span>
            </div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
              {role === 'faculty' ? 'Faculty Portal Sign In' : 'Organize Your Academic Life'}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {role === 'faculty' ? 'Review student submissions, track progress & assign grades.' : 'The smart way to track assignments and deadlines.'}
            </p>
          </header>
          
          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl mb-6 border border-slate-200">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${role === 'student' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <span className="material-symbols-outlined text-[18px]">school</span> Student Portal
            </button>
            <button
              type="button"
              onClick={() => setRole('faculty')}
              className={`py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${role === 'faculty' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <span className="material-symbols-outlined text-[18px]">supervisor_account</span> Faculty Portal
            </button>
          </div>

          {error && <div className="mb-4 text-error text-sm font-bold bg-error-container p-3 rounded-lg">{error}</div>}

          <form className="space-y-md animate-fade-in delay-200" onSubmit={handleSubmit}>
            <div className="space-y-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="email">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                <input 
                  className="notion-input w-full pl-10 pr-md py-[10px] rounded-lg border border-outline-variant bg-surface text-body-md font-body-md transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  id="email" 
                  placeholder="alex.rivers@university.edu" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-xs">
              <div className="flex justify-between items-center">
                <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="password">Password</label>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                <input 
                  className="notion-input w-full pl-10 pr-md py-[10px] rounded-lg border border-outline-variant bg-surface text-body-md font-body-md transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button 
              className="w-full bg-primary hover:bg-primary/90 text-on-primary font-button text-button py-[12px] rounded-lg shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-sm" 
              type="submit"
              disabled={loading}
            >
              {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : 'Log in'}
            </button>
          </form>
          
          <footer className="mt-xl text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Sign up</Link>
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default Login;
