import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CustomerDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="page-container">
            <h2>Customer Dashboard</h2>

            <p>
                Welcome, <strong>{user?.name}</strong>!
            </p>

            <div className="dashboard-cards">
                <div className="card">
                    <h3>Browse Assets</h3>
                    <p>View salon assets available for rental.</p>
                    <Link to="/services" className="btn">
                        Browse Assets
                    </Link>
                </div>

                <div className="card">
                    <h3>My Bookings</h3>
                    <p>View your current and previous rentals.</p>
                    <Link to="/my-bookings" className="btn">
                        My Bookings
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;