import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import FacultyDashboard from './pages/FacultyDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/assignments" element={<Assignments />} />
      <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
    </Routes>
  );
}

export default App;
