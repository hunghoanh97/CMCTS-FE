import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import QuestionManager from '../components/QuestionManager';

interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    level: number;
    totalXP: number;
    lastOnlineAt: string | null;
    completedQuizzes: number;
}

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState<'users' | 'questions'>('users');
    
    // Filters
    const [filterEmail, setFilterEmail] = useState('');
    const [filterMinXP, setFilterMinXP] = useState<number | ''>('');
    const [filterCompletedQuizzes, setFilterCompletedQuizzes] = useState<number | ''>('');

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
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [navigate, activeTab]);

    const handleRemind = (email: string) => {
        // Mock function cho tính năng nhắc nhở
        alert(`Đã gửi email nhắc nhở tới: ${email}`);
    };

    const filteredUsers = users
        .filter(u => u.role !== 'Admin')
        .filter(u => u.email.toLowerCase().includes(filterEmail.toLowerCase()))
        .filter(u => filterMinXP === '' || u.totalXP >= filterMinXP)
        .filter(u => filterCompletedQuizzes === '' || u.completedQuizzes >= filterCompletedQuizzes);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold" style={{ color: '#0065B2' }}>Admin</h2>
                </div>
                <div className="flex-1 p-4 space-y-2">
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Quản lý Người dùng
                    </button>
                    <button 
                        onClick={() => setActiveTab('questions')}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'questions' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Quản lý Câu hỏi
                    </button>
                </div>
                <div className="p-4 border-t">
                    <button onClick={() => navigate('/gamehub')} className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 transition-colors text-white rounded">Về GameHub</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8">
                {activeTab === 'users' && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-6">Danh sách Người dùng</h3>
                        
                        {/* Filters */}
                        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tìm theo Email</label>
                                <input 
                                    type="text" 
                                    placeholder="Nhập email..."
                                    value={filterEmail}
                                    onChange={(e) => setFilterEmail(e.target.value)}
                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">XP tối thiểu</label>
                                <input 
                                    type="number" 
                                    placeholder="0"
                                    value={filterMinXP}
                                    onChange={(e) => setFilterMinXP(e.target.value ? Number(e.target.value) : '')}
                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số chặng đã hoàn thành (tối thiểu)</label>
                                <input 
                                    type="number" 
                                    placeholder="0"
                                    value={filterCompletedQuizzes}
                                    onChange={(e) => setFilterCompletedQuizzes(e.target.value ? Number(e.target.value) : '')}
                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-3 text-left font-semibold text-gray-600">ID</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Tên</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Tổng XP</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Quiz đã làm</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Online lần cuối</th>
                                        <th className="px-4 py-3 text-center font-semibold text-gray-600">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-gray-500 italic">
                                                Không tìm thấy người dùng nào phù hợp với điều kiện lọc.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map(u => (
                                            <tr key={u.id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3">{u.id}</td>
                                                <td className="px-4 py-3 font-medium">{u.name}</td>
                                                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                                                <td className="px-4 py-3 font-bold text-blue-600">{u.totalXP}</td>
                                                <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${u.completedQuizzes > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {u.completedQuizzes} chặng
                                                </span>
                                            </td>
                                                <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">
                                                {u.lastOnlineAt ? new Date(u.lastOnlineAt).toLocaleString('vi-VN') : 'Chưa đăng nhập'}
                                            </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button 
                                                        onClick={() => handleRemind(u.email)}
                                                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded shadow transition-colors"
                                                    >
                                                        Nhắc nhở
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'questions' && (
                    <QuestionManager />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
