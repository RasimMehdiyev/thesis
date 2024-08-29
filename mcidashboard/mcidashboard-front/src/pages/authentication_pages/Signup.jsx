import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const history = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/dashboard/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email }),
        });

        if (response.ok) {
            history.push('/login');
        } else {
            const data = await response.json();
            setError(data.error || 'Something went wrong');
        }
    };

    return (
        <div className='auth'>
            <h2 className='auth-title'>Sign Up</h2>
            {error && <p>{error}</p>}
            <form className='signup-form' onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button className='auth-button' type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default Signup;
