import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();  // useNavigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/dashboard/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Custom-Token': 'admin_power',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            navigate('/');
        } else {
            const data = await response.json();
            setError(data.error || 'Invalid credentials');
        }
    };

    return (
        <div className='auth'>
            <h2 className='auth-title'>Login</h2>
            {error && <p>{error}</p>}
            <form className='login-form' onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button className='auth-button' type="submit">Login</button>
            </form>
        </div>
    );
}

// Helper function to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export default Login;
