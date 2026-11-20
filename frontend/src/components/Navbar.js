import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
    logout();
    navigate('/');
};

    if (!user) return null;

    return (
        <div className="navbar">
            <div className="navbar-brand">Salon Rental System</div>
            <div>
                {user.role === 'customer' && (
                    <>
                        <Link to="/services">Services</Link>
                        <Link to="/my-bookings">My Bookings</Link>
                    </>
                )}
                        {user.role === 'admin' && <Link to="/admin-dashboard">Dashboard</Link>}
                        {user.role === 'staff' && <Link to="/staff-dashboard">Dashboard</Link>}
                <span className="navbar-user">
                    {user.name} ({user.role})
                </span>
                <button onClick={handleLogout} className="btn-secondary">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Navbar;