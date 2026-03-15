import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubmitActivity from './pages/SubmitActivity'
// import PublicVerify from './pages/PublicVerify';
import StudentProfile from './pages/StudentProfile';
import Navbar from './components/Navbar'
import VerifyCertificate from './pages/VerifyCertificate'
import RecruiterPortfolio from './pages/RecruiterPortfolio';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="text-6xl mb-4">🎓</div>
          <div className="text-2xl font-bold text-gray-800">AchievR</div>
          <div className="text-gray-600 mt-2">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing user={user} setUser={setUser} />} />
        <Route path="/login" element={user ? <Navigate to={user.role === 'student' ? '/dashboard' : `/${user.role}`} /> : <Login setUser={setUser} />} />
        <Route path="/register" element={user ? <Navigate to={user.role === 'student' ? '/dashboard' : `/${user.role}`} /> : <Register />} />
        {/* // <Route path="/verify/:hash" element={<PublicVerify />} /> */}
        <Route path="/verify/:certificateId" element={<VerifyCertificate />} />

        <Route path="/portfolio/:slug" element={<RecruiterPortfolio />} />


        {/* Protected Routes - Student */}
        {user?.role === 'student' && (
          <>
            <Route path="/dashboard" element={<><Navbar user={user} setUser={setUser} /><StudentDashboard user={user} /></>} />
            <Route path="/submit" element={<><Navbar user={user} setUser={setUser} /><SubmitActivity user={user} /></>} />
            <Route path="/profile" element={<><Navbar user={user} setUser={setUser} /><StudentProfile user={user} /></>} />
          </>
        )}

        {/* Protected Routes - Faculty */}
        {user?.role === 'faculty' && (
          <Route path="/faculty" element={<><Navbar user={user} setUser={setUser} /><FacultyDashboard user={user} /></>} />
        )}

        {/* Protected Routes - Admin */}
        {user?.role === 'admin' && (
          <Route path="/admin" element={<><Navbar user={user} setUser={setUser} /><AdminDashboard user={user} /></>} />
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}