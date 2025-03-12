import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [, setToken] = useLocalStorage<string | null>('token', null); // Adjust the path as necessary
    const navigate = useNavigate();

    const handleLogin = async () => {
        console.log('Attempting to login with', { username, password });

        if (!username || !password) {
            console.log('Username or password is missing');
            setError('Username and password are required');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('https://joart.azurewebsites.net/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                console.log('Login failed:', response.statusText);
                throw new Error('Invalid username or password');
            }

            const responseData = await response.json();
            console.log('Response data:', responseData);

            const { token } = responseData;
            console.log('Received token:', token);
            setToken(token);  // Store the token using useLocalStorage

            console.log('Token stored in localStorage');

            navigate('/admin');
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Invalid username or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                />
            </div>
            <button onClick={handleLogin} className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default Login;
