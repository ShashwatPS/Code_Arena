'use client';
import { useState } from 'react';

export default function SignupForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages
        setLoading(true); // Set loading state

        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            // Check if response is ok
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Signup failed');
            }

            const data = await res.json();
            setMessage('Signup successful! You can now log in.');
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
            {message && <p>{message}</p>}
        </form>
    );
}
