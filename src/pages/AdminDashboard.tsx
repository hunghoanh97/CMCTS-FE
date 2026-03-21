import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    level: number;
    totalXP: number;
}

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/admin/users');
                setUsers(response.data);
            } catch (err: any) {
                if (err.response?.status === 403 || err.response?.status === 401) {
                    navigate('/gamehub'); // Không có quyền
                }
            }
        };
        fetchUsers();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold" style={{ color: '#0065B2' }}>Admin Dashboard</h2>
                    <button onClick={() => navigate('/gamehub')} className="px-4 py-2 bg-gray-500 text-white rounded">Back to GameHub</button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4">Danh sách User</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left">ID</th>
                                    <th className="px-4 py-2 text-left">Tên</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Role</th>
                                    <th className="px-4 py-2 text-left">Level</th>
                                    <th className="px-4 py-2 text-left">XP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} className="border-b">
                                        <td className="px-4 py-2">{u.id}</td>
                                        <td className="px-4 py-2">{u.name}</td>
                                        <td className="px-4 py-2">{u.email}</td>
                                        <td className="px-4 py-2">{u.role}</td>
                                        <td className="px-4 py-2">{u.level}</td>
                                        <td className="px-4 py-2">{u.totalXP}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
