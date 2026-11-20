import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'customer',
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await API.post('/auth/register', formData);

            login(res.data);

            // Redirect based on role
            if (res.data.role === 'admin') {
                navigate('/admin-dashboard');
            } else if (res.data.role === 'staff') {
                navigate('/staff-dashboard');
            } else {
                navigate('/customer-dashboard');
            }

        } catch (err) {
            setError(
                err.response?.data?.message || 'Registration failed'
            );
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h2>Register</h2>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Role</label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="customer">Customer</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn-block"
                    >
                        Register
                    </button>

                </form>

                <p className="auth-link">
                    Already have an account?{' '}
                    <Link to="/login">Login</Link>
                </p>

            </div>
        </div>
    );
};

export default Register;