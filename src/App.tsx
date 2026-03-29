import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import GameHub from './pages/GameHub';
import AdminDashboard from './pages/AdminDashboard';
import AuthCallback from './pages/AuthCallback';

const PrivateRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
    const token = localStorage.getItem('token');
    
    if (!token) return <Navigate to="/login" />;

    if (requireAdmin) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.role !== 'Admin') return <Navigate to="/gamehub" />;
        } catch {
            return <Navigate to="/login" />;
        }
    }

    return <>{children}</>;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route
                    path="/gamehub" 
                    element={
                        <PrivateRoute>
                            <GameHub />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/admin" 
                    element={
                        <PrivateRoute requireAdmin={true}>
                            <AdminDashboard />
                        </PrivateRoute>
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;
