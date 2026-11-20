
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('STEP 1: Form submitted');
        console.log('Email:', email);

        setError('');

        try {
            console.log('STEP 2: Sending request to backend...');

            const res = await API.post('/auth/login', {
                email,
                password
            });

            console.log('STEP 3: Response received:', res.data);

            login(res.data);

            console.log('STEP 4: login() called');

            if (res.data.role === 'admin') {
    navigate('/admin-dashboard');
} else if (res.data.role === 'staff') {
    navigate('/staff-dashboard');
} else if (res.data.role === 'customer') {
    navigate('/customer-dashboard');
}

        } catch (err) {
            console.log('ERROR CAUGHT:', err);
            console.log('ERROR RESPONSE:', err.response?.data);
            console.log('ERROR STATUS:', err.response?.status);

            setError(
                err.response?.data?.message ||
                'Invalid email or password'
            );
        }
    };

    return (
        <div className="auth-container">
    <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <button type="submit">Login</button>
        </form>

        <p className="auth-link">
            Don't have an account? <Link to="/register">Register</Link>
        </p>
    </div>
</div>
    );
};

export default Login;

