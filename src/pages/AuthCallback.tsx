import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Parse token and returnUrl from URL fragment
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const token = hashParams.get('token');
        const returnUrl = hashParams.get('returnUrl') || '/gamehub';

        if (token) {
            localStorage.setItem('token', token);
            navigate(returnUrl);
        } else {
            // Handle error or fallback
            navigate('/login');
        }
    }, [navigate, location]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#0B33CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-[#0B33CC]">Đang xử lý đăng nhập...</h2>
            </div>
        </div>
    );
};

export default AuthCallback;