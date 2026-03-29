import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

interface Stage {
    id: number;
    name: string;
    description: string;
    isUnlocked: boolean;
    isCompleted?: boolean;
}

interface Option {
    id: number;
    content: string;
}

interface Question {
    id: number;
    content: string;
    options: Option[];
    hasAnswered?: boolean;
    isCorrect?: boolean;
    selectedAnswerId?: number;
    correctAnswerId?: number;
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
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [result, setResult] = useState<string | null>(null);
    
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [individualLeaderboard, setIndividualLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [allianceLeaderboard, setAllianceLeaderboard] = useState<AllianceLeaderboardEntry[]>([]);
    const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<'individual' | 'alliance'>('individual');
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Kiểm tra xem có token không, nếu không có thì redirect về trang đăng nhập
                if (!localStorage.getItem('token')) {
                    navigate('/login');
                    return;
                }

                const [stagesRes, profileRes, lbRes] = await Promise.all([
                    api.get('/quiz/stages'),
                    api.get('/user/profile'),
                    api.get('/user/leaderboard')
                ]);
                const fetchedStages = stagesRes.data;
                setStages(fetchedStages);
                setProfile(profileRes.data);

                // Auto-select the first unlocked and UNCOMPLETED stage, or the last unlocked stage if all are completed
                if (fetchedStages && fetchedStages.length > 0) {
                    const firstUncompletedStage = fetchedStages.find((s: Stage) => s.isUnlocked && !s.isCompleted);
                    if (firstUncompletedStage) {
                        handleSelectStage(firstUncompletedStage.id);
                    } else {
                        const lastUnlockedStage = [...fetchedStages].reverse().find((s: Stage) => s.isUnlocked);
                        if (lastUnlockedStage) {
                            handleSelectStage(lastUnlockedStage.id);
                        }
                    }
                }
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
            setSelectedAnswers({});
        } catch (err) {
            console.error(err);
        }
    };

    const handleOptionChange = (questionId: number, answerId: number) => {
        const question = questions.find(q => q.id === questionId);
        if (question?.hasAnswered) return; // Không cho phép chọn lại nếu đã trả lời

        setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
    };

    const handleSubmit = async (questionId: number) => {
        if (!selectedAnswers[questionId]) return;
        try {
            const response = await api.post('/quiz/submit', {
                stageId: activeStage,
                questionId: questionId,
                answerId: selectedAnswers[questionId]
            });
            setResult(response.data.message);
            
            // Lấy trạng thái đúng/sai từ API response (Backend đã trả về isCorrect)
            const isCorrect = response.data.isCorrect;

            // Refresh profile and leaderboard
            const [profileRes, lbRes] = await Promise.all([
                api.get('/user/profile'),
                api.get('/user/leaderboard')
            ]);
            setProfile(profileRes.data);
            setIndividualLeaderboard(lbRes.data.individual);
            setAllianceLeaderboard(lbRes.data.alliance);

            // Cập nhật state nội bộ ngay lập tức để UI phản hồi không bị giật
            setQuestions(prev => prev.map(q => {
                if (q.id === questionId) {
                    return {
                        ...q,
                        hasAnswered: true,
                        isCorrect,
                        selectedAnswerId: selectedAnswers[questionId],
                        correctAnswerId: response.data.correctAnswerId
                    };
                }
                return q;
            }));

            // Clear selected answer for that question
            setSelectedAnswers(prev => {
                const newState = { ...prev };
                delete newState[questionId];
                return newState;
            });
        } catch (err: any) {
            setResult(err.response?.data?.message || 'Có lỗi xảy ra!');
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {stages.map(stage => (
                                    <div 
                                        key={stage.id} 
                                        className={`p-4 rounded-lg shadow transition relative ${activeStage === stage.id ? 'ring-2 ring-blue-500' : ''} ${stage.isUnlocked ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed opacity-70'}`}
                                        style={{ backgroundColor: stage.isUnlocked ? '#00AEEF' : '#F4F4F4', color: stage.isUnlocked ? 'white' : '#666' }}
                                        onClick={() => stage.isUnlocked && handleSelectStage(stage.id)}
                                    >
                                        <h4 className="font-bold pr-6">{stage.name}</h4>
                                        {!stage.isUnlocked && <span className="text-xs block mt-1">(Chưa mở)</span>}
                                        {stage.isCompleted && (
                                            <div className="absolute top-2 right-2 text-yellow-300 text-xl" title="Đã hoàn thành">
                                                🏆
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Questions */}
                        {activeStage && (
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4" style={{ borderColor: '#00AEEF' }}>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold">Nhiệm vụ chặng</h3>
                                    <div className="hidden md:flex gap-2">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">🌟 CMCTS 20 Năm</span>
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">Tự hào kiến tạo</span>
                                    </div>
                                </div>
                                
                                {result && (
                                    <div className="mb-6 p-4 rounded bg-blue-50 text-blue-800 font-bold border border-blue-200 flex items-center gap-3">
                                        <span className="text-2xl">🎉</span> {result}
                                    </div>
                                )}
                                
                                {questions.length === 0 ? (
                                    <div className="text-center py-8">
                                        <img src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20futuristic%20technology%20company%20anniversary%20celebration%20with%20number%2020%2C%20blue%20color%20theme%2C%20flat%20illustration&image_size=landscape_16_9" alt="CMCTS 20 Years" className="w-full max-w-md mx-auto rounded-lg mb-4 opacity-80" />
                                        <p className="text-gray-500">Hiện tại chưa có câu hỏi nào cho chặng này. Hãy quay lại sau nhé!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {questions.map(q => (
                                            <div key={q.id} className={`border-2 p-6 rounded-xl transition-all ${q.hasAnswered ? (q.isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50') : 'border-gray-200 hover:border-blue-400'}`}>
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    {/* Hình ảnh minh họa random cho sinh động */}
                                                    <div className="w-full md:w-1/3 shrink-0">
                                                        <img 
                                                            src={`https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Technology%20company%20puzzle%20question%20illustration%20for%20number%20${q.id}%2C%20blue%20and%20cyan%20theme%2C%20modern%20corporate&image_size=landscape_4_3`} 
                                                            alt="Question illustration" 
                                                            className="w-full h-32 object-cover rounded-lg shadow-sm"
                                                        />
                                                    </div>
                                                    
                                                    <div className="flex-1">
                                                        <p className="font-bold text-lg mb-4 text-gray-800">{q.content}</p>
                                                        
                                                        <div className="space-y-3">
                                                            {q.options.map(opt => {
                                                                // Logic hiển thị trạng thái đáp án
                                                                const isSelected = selectedAnswers[q.id] === opt.id || q.selectedAnswerId === opt.id;
                                                                let optionClass = "border border-gray-300 hover:bg-blue-50";
                                                                
                                                                if (q.hasAnswered) {
                                                                    // Nếu câu hỏi đã trả lời, đáp án ĐÚNG luôn được highlight màu xanh (bất kể user có chọn hay không)
                                                                    const isCorrectOption = opt.id === q.correctAnswerId;
                                                                    
                                                                    if (isCorrectOption) {
                                                                        optionClass = "bg-green-500 text-white font-bold border-green-600";
                                                                    } else if (isSelected && !q.isCorrect) {
                                                                        // Nếu user chọn sai, bôi đỏ đáp án đã chọn
                                                                        optionClass = "bg-red-500 text-white font-bold border-red-600";
                                                                    } else {
                                                                        // Các đáp án khác làm mờ
                                                                        optionClass = "bg-gray-100 text-gray-400 border-gray-200 opacity-60";
                                                                    }
                                                                } else if (isSelected) {
                                                                    optionClass = "border-blue-500 bg-blue-50 ring-1 ring-blue-500";
                                                                }

                                                                return (
                                                                    <label key={opt.id} className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${optionClass} ${q.hasAnswered ? 'cursor-not-allowed' : ''}`}>
                                                                        <input 
                                                                            type="radio" 
                                                                            name={`question-${q.id}`} 
                                                                            value={opt.id}
                                                                            checked={isSelected}
                                                                            onChange={() => handleOptionChange(q.id, opt.id)}
                                                                            disabled={q.hasAnswered}
                                                                            className={`form-radio h-5 w-5 ${q.hasAnswered ? ((isSelected || opt.id === q.correctAnswerId) ? 'text-white' : 'text-gray-400') : 'text-blue-600'}`}
                                                                        />
                                                                        <span className="flex-1">{opt.content}</span>
                                                                        {q.hasAnswered && opt.id === q.correctAnswerId && (
                                                                            <span className="text-xl">✅</span>
                                                                        )}
                                                                        {q.hasAnswered && isSelected && !q.isCorrect && (
                                                                            <span className="text-xl">❌</span>
                                                                        )}
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>

                                                        {!q.hasAnswered && (
                                                            <button 
                                                                onClick={() => handleSubmit(q.id)}
                                                                disabled={!selectedAnswers[q.id] || q.hasAnswered}
                                                            className={`mt-6 px-8 py-3 rounded-lg font-bold transition-all shadow-md w-full md:w-auto ${
                                                                q.hasAnswered 
                                                                    ? 'bg-gray-400 text-white cursor-not-allowed hidden' 
                                                                    : selectedAnswers[q.id] 
                                                                        ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg transform hover:-translate-y-0.5' 
                                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            }`}
                                                            >
                                                                Xác nhận đáp án
                                                            </button>
                                                        )}
                                                        {q.hasAnswered && (
                                                            <div className={`mt-4 font-bold text-sm ${q.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                                                {q.isCorrect ? 'Bạn đã trả lời ĐÚNG câu hỏi này!' : 'Bạn đã trả lời SAI câu hỏi này.'}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
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
