import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

interface Stage {
    id: number;
    name: string;
    description: string;
    isUnlocked: boolean;
}

interface Question {
    id: number;
    content: string;
    options: { id: number, content: string }[];
}

interface UserProfile {
    name: string;
    avatarUrl?: string;
    allianceName: string;
    level: number;
    totalXP: number;
    nextLevelXP: number;
}

interface LeaderboardEntry {
    id: number;
    name: string;
    level: number;
    totalXP: number;
}

interface AllianceLeaderboardEntry {
    allianceId: number;
    allianceName: string;
    totalXP: number;
}

const GameHub: React.FC = () => {
    const [stages, setStages] = useState<Stage[]>([]);
    const [activeStage, setActiveStage] = useState<number | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [result, setResult] = useState<string | null>(null);
    
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [individualLeaderboard, setIndividualLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [allianceLeaderboard, setAllianceLeaderboard] = useState<AllianceLeaderboardEntry[]>([]);
    const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<'individual' | 'alliance'>('individual');
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stagesRes, profileRes, lbRes] = await Promise.all([
                    api.get('/quiz/stages'),
                    api.get('/user/profile'),
                    api.get('/user/leaderboard')
                ]);
                setStages(stagesRes.data);
                setProfile(profileRes.data);
                setIndividualLeaderboard(lbRes.data.individual);
                setAllianceLeaderboard(lbRes.data.alliance);
            } catch (err) {
                console.error(err);
                navigate('/login');
            }
        };
        fetchData();
    }, [navigate]);

    const handleSelectStage = async (stageId: number) => {
        try {
            const response = await api.get(`/quiz/stages/${stageId}/questions`);
            setQuestions(response.data);
            setActiveStage(stageId);
            setResult(null);
            setAnswers({});
        } catch (err) {
            console.error(err);
        }
    };

    const handleOptionChange = (questionId: number, answerId: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: answerId }));
    };

    const handleSubmit = async (questionId: number) => {
        if (!answers[questionId]) return;
        try {
            const response = await api.post('/quiz/submit', {
                stageId: activeStage,
                questionId: questionId,
                answerId: answers[questionId]
            });
            setResult(response.data.message);
            
            // Refresh profile and leaderboard
            const [profileRes, lbRes] = await Promise.all([
                api.get('/user/profile'),
                api.get('/user/leaderboard')
            ]);
            setProfile(profileRes.data);
            setIndividualLeaderboard(lbRes.data.individual);
            setAllianceLeaderboard(lbRes.data.alliance);

        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const isAdmin = localStorage.getItem('token') && JSON.parse(atob(localStorage.getItem('token')!.split('.')[1])).role === 'Admin';

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold" style={{ color: '#0065B2' }}>Game Hub</h2>
                    <div className="space-x-4">
                        {isAdmin && (
                            <button onClick={() => navigate('/admin')} className="px-4 py-2 bg-yellow-500 text-white rounded">
                                Admin Dashboard
                            </button>
                        )}
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile & Leaderboard */}
                    <div className="space-y-8">
                        {/* Profile Bar */}
                        {profile && (
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4" style={{ borderColor: '#0065B2' }}>
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">
                                        {profile.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{profile.name}</h3>
                                        <p className="text-sm text-gray-500">Liên quân: {profile.allianceName}</p>
                                        <p className="text-sm font-semibold" style={{ color: '#00AEEF' }}>Level {profile.level}</p>
                                    </div>
                                </div>
                                
                                {/* XP Indicator */}
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>XP hiện tại: {profile.totalXP}</span>
                                        <span>Mục tiêu: {profile.nextLevelXP}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="h-2.5 rounded-full" style={{ width: `${Math.min(100, (profile.totalXP / profile.nextLevelXP) * 100)}%`, backgroundColor: '#00AEEF' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Leaderboard Preview */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold" style={{ color: '#0065B2' }}>Bảng xếp hạng</h3>
                            </div>
                            
                            <div className="flex space-x-2 mb-4 border-b">
                                <button 
                                    className={`pb-2 px-2 font-semibold ${activeLeaderboardTab === 'individual' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                                    onClick={() => setActiveLeaderboardTab('individual')}
                                >
                                    Cá nhân
                                </button>
                                <button 
                                    className={`pb-2 px-2 font-semibold ${activeLeaderboardTab === 'alliance' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                                    onClick={() => setActiveLeaderboardTab('alliance')}
                                >
                                    Liên quân
                                </button>
                            </div>

                            <ul className="space-y-3">
                                {activeLeaderboardTab === 'individual' ? (
                                    individualLeaderboard.map((entry, index) => (
                                        <li key={entry.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                            <div className="flex items-center space-x-3">
                                                <span className={`font-bold w-6 ${index < 3 ? 'text-yellow-500' : 'text-gray-500'}`}>#{index + 1}</span>
                                                <span>{entry.name}</span>
                                            </div>
                                            <span className="font-semibold text-sm">{entry.totalXP} XP</span>
                                        </li>
                                    ))
                                ) : (
                                    allianceLeaderboard.map((entry, index) => (
                                        <li key={entry.allianceId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                            <div className="flex items-center space-x-3">
                                                <span className={`font-bold w-6 ${index < 3 ? 'text-yellow-500' : 'text-gray-500'}`}>#{index + 1}</span>
                                                <span>{entry.allianceName}</span>
                                            </div>
                                            <span className="font-semibold text-sm">{entry.totalXP} XP</span>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Journey Map & Questions */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Journey Map */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-4">Lộ trình sự kiện</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {stages.map(stage => (
                                    <div 
                                        key={stage.id} 
                                        className={`p-4 rounded-lg shadow cursor-pointer transition ${activeStage === stage.id ? 'ring-2 ring-blue-500' : ''}`}
                                        style={{ backgroundColor: stage.isUnlocked ? '#00AEEF' : '#F4F4F4', color: stage.isUnlocked ? 'white' : '#666' }}
                                        onClick={() => handleSelectStage(stage.id)}
                                    >
                                        <h4 className="font-bold">{stage.name}</h4>
                                        {!stage.isUnlocked && <span className="text-xs">(Chưa mở)</span>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Questions */}
                        {activeStage && (
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4" style={{ borderColor: '#00AEEF' }}>
                                <h3 className="text-2xl font-bold mb-4">Nhiệm vụ chặng</h3>
                                {result && (
                                    <div className="mb-4 p-4 rounded bg-blue-50 text-blue-800 font-bold border border-blue-200">
                                        {result}
                                    </div>
                                )}
                                {questions.length === 0 ? (
                                    <p className="text-gray-500">Hiện tại chưa có câu hỏi nào cho chặng này.</p>
                                ) : (
                                    <div className="space-y-6">
                                        {questions.map(q => (
                                            <div key={q.id} className="border p-4 rounded-lg">
                                                <p className="font-semibold mb-3">{q.content}</p>
                                                <div className="space-y-2">
                                                    {q.options.map(opt => (
                                                        <label key={opt.id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                            <input 
                                                                type="radio" 
                                                                name={`question-${q.id}`} 
                                                                value={opt.id}
                                                                checked={answers[q.id] === opt.id}
                                                                onChange={() => handleOptionChange(q.id, opt.id)}
                                                                className="form-radio h-4 w-4 text-blue-600"
                                                            />
                                                            <span>{opt.content}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <button 
                                                    onClick={() => handleSubmit(q.id)}
                                                    className="mt-4 px-6 py-2 text-white rounded font-semibold transition hover:opacity-90"
                                                    style={{ backgroundColor: '#0065B2' }}
                                                >
                                                    Gửi đáp án
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameHub;
