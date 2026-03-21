import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface Answer {
    id?: number;
    content: string;
    isCorrect: boolean;
}

interface Question {
    id: number;
    stageId: number;
    content: string;
    xpReward: number;
    answers: Answer[];
}

interface Stage {
    id: number;
    name: string;
    description: string;
}

const QuestionManager: React.FC = () => {
    const [stages, setStages] = useState<Stage[]>([]);
    const [selectedStage, setSelectedStage] = useState<number | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

    // Form state
    const [content, setContent] = useState('');
    const [xpReward, setXpReward] = useState(100);
    const [answers, setAnswers] = useState<Answer[]>([
        { content: '', isCorrect: true },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false }
    ]);

    useEffect(() => {
        const fetchStages = async () => {
            try {
                const response = await api.get('/quiz/stages');
                setStages(response.data);
                if (response.data.length > 0) {
                    setSelectedStage(response.data[0].id);
                }
            } catch (err) {
                console.error('Failed to fetch stages', err);
            }
        };
        fetchStages();
    }, []);

    useEffect(() => {
        const fetchQuestions = async () => {
            if (selectedStage) {
                try {
                    const response = await api.get(`/quiz/stages/${selectedStage}/questions`);
                    setQuestions(response.data);
                } catch (err) {
                    console.error('Failed to fetch questions', err);
                }
            }
        };
        fetchQuestions();
    }, [selectedStage]);

    const handleEdit = (q: Question) => {
        setEditingQuestion(q);
        setContent(q.content);
        setXpReward(q.xpReward);
        // Ensure we always have 4 answer slots for UI simplicity
        const paddedAnswers = q.answers ? [...q.answers] : [];
        while (paddedAnswers.length < 4) {
            paddedAnswers.push({ content: '', isCorrect: false });
        }
        setAnswers(paddedAnswers.slice(0, 4));
    };

    const handleAddNew = () => {
        setEditingQuestion(null);
        setContent('');
        setXpReward(100);
        setAnswers([
            { content: '', isCorrect: true },
            { content: '', isCorrect: false },
            { content: '', isCorrect: false },
            { content: '', isCorrect: false }
        ]);
    };

    const handleSave = async () => {
        if (!selectedStage) return;

        const validAnswers = answers.filter(a => a.content.trim() !== '');
        if (validAnswers.length < 2) {
            alert('Cần ít nhất 2 đáp án!');
            return;
        }
        if (!validAnswers.some(a => a.isCorrect)) {
            alert('Cần chọn ít nhất 1 đáp án đúng!');
            return;
        }

        const payload = {
            stageId: selectedStage,
            content,
            xpReward,
            answers: validAnswers
        };

        try {
            if (editingQuestion) {
                await api.put(`/admin/questions/${editingQuestion.id}`, payload);
                alert('Cập nhật thành công!');
            } else {
                await api.post('/admin/questions', payload);
                alert('Thêm mới thành công!');
            }
            
            // Refresh
            const response = await api.get(`/quiz/stages/${selectedStage}/questions`);
            setQuestions(response.data);
            handleAddNew(); // Reset form
        } catch (err) {
            console.error(err);
            alert('Có lỗi xảy ra khi lưu câu hỏi.');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
            try {
                await api.delete(`/admin/questions/${id}`);
                setQuestions(questions.filter(q => q.id !== id));
            } catch (err) {
                console.error(err);
                alert('Có lỗi xảy ra khi xóa.');
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Quản lý Câu hỏi Quiz</h3>
                <div className="flex items-center gap-4">
                    <label className="font-medium text-gray-700">Chọn Chặng:</label>
                    <select 
                        value={selectedStage || ''} 
                        onChange={(e) => setSelectedStage(Number(e.target.value))}
                        className="p-2 border rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        {stages.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex gap-8 flex-1">
                {/* List Questions */}
                <div className="flex-1 border-r pr-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-gray-700">Danh sách Câu hỏi</h4>
                        <button 
                            onClick={handleAddNew}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition-colors"
                        >
                            + Thêm mới
                        </button>
                    </div>
                    
                    {questions.length === 0 ? (
                        <p className="text-gray-500 italic text-center py-8">Chưa có câu hỏi nào trong chặng này.</p>
                    ) : (
                        <div className="space-y-4">
                            {questions.map(q => (
                                <div key={q.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-medium text-gray-800">{q.content}</p>
                                        <div className="flex gap-2 shrink-0">
                                            <button onClick={() => handleEdit(q)} className="text-blue-500 hover:text-blue-700 text-sm">Sửa</button>
                                            <button onClick={() => handleDelete(q.id)} className="text-red-500 hover:text-red-700 text-sm">Xóa</button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-blue-600 mb-2">Thưởng: {q.xpReward} XP</p>
                                    <ul className="text-sm space-y-1">
                                        {q.answers && q.answers.map((a, idx) => (
                                            <li key={`ans-${q.id}-${a.id || idx}`} className={`${a.isCorrect ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                                                {a.isCorrect ? '✓' : '○'} {a.content}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Form Editor */}
                <div className="flex-1 pl-2">
                    <h4 className="font-bold text-gray-700 mb-4">
                        {editingQuestion ? 'Sửa Câu hỏi' : 'Thêm Câu hỏi mới'}
                    </h4>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung câu hỏi</label>
                            <textarea 
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                rows={3}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">XP Thưởng</label>
                            <input 
                                type="number" 
                                value={xpReward}
                                onChange={(e) => setXpReward(Number(e.target.value))}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Các Đáp án (Chọn đáp án đúng)</label>
                            {answers.map((a, idx) => (
                                <div key={idx} className="flex items-center gap-3 mb-2">
                                    <input 
                                        type="radio" 
                                        name="correctAnswer" 
                                        checked={a.isCorrect}
                                        onChange={() => {
                                            const newAnswers = [...answers];
                                            newAnswers.forEach(ans => ans.isCorrect = false);
                                            newAnswers[idx].isCorrect = true;
                                            setAnswers(newAnswers);
                                        }}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <input 
                                        type="text" 
                                        value={a.content}
                                        onChange={(e) => {
                                            const newAnswers = [...answers];
                                            newAnswers[idx].content = e.target.value;
                                            setAnswers(newAnswers);
                                        }}
                                        placeholder={`Đáp án ${idx + 1}`}
                                        className="flex-1 p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={handleSave}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition-colors mt-4"
                        >
                            {editingQuestion ? 'Cập nhật' : 'Tạo mới'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionManager;