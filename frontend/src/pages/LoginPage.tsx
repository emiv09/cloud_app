import React, { useState } from 'react';
import { login } from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        const success = await login(username, password);
        if (success) {
            navigate('/dashboard');
        } else {
            alert('Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen font-sans">
            <div className="flex flex-col items-center">
                <h2 className="mb-6 text-2xl font-semibold">Login - AWS Cognito Auth</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mb-4 px-4 py-2 border rounded w-64"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4 px-4 py-2 border rounded w-64"
                />
                <button
                    onClick={handleLogin}
                    className="px-6 py-2 bg-blue-600 text-white rounded transition-colors duration-300 hover:bg-blue-700 cursor-pointer"
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default LoginPage;
