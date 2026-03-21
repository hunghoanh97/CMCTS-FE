import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/gamehub');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleSsoLogin = async () => {
        try {
            const response = await api.get('/auth/sso-login');
            localStorage.setItem('token', response.data.token);
            navigate('/gamehub');
        } catch (err: any) {
            setError(err.response?.data?.message || 'SSO Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#0065B2' }}>CMC TS - CTS20</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 text-white rounded transition"
                        style={{ backgroundColor: '#0065B2' }}
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <button
                        onClick={handleSsoLogin}
                        className="w-full py-2 bg-gray-800 text-white rounded transition"
                    >
                        SSO Login (Mock)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
