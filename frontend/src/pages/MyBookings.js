import { useState, useEffect } from 'react';
import API from '../api/axios';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');

    const fetchMyBookings = async () => {
        try {
            const res = await API.get('/booking/my');
            setBookings(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load your bookings');
        }
    };

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const statusColor = (status) => {
        switch (status) {
            case 'booked':
                return '#e67e22';
            case 'ongoing':
                return '#2980b9';
            case 'returned':
                return '#27ae60';
            case 'cancelled':
                return '#c0392b';
            default:
                return '#333';
        }
    };

    const badgeClass = (status) => `badge badge-${status}`;

    return (
        <div className="page-container">
            <h2>My Bookings</h2>

            {error && <div className="alert alert-error">{error}</div>}
            {bookings.length === 0 && !error && <p>You have no bookings yet.</p>}

            {bookings.map((b) => (
                <div key={b._id} className="card">
                    <h3>{b.service?.name}</h3>
                    <p>
                        <strong>Rental period:</strong>{' '}
                        {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}
                    </p>
                    <p><strong>Total price:</strong> ₹{b.totalPrice}</p>
                    <p>
                        <strong>Status:</strong> <span className={badgeClass(b.status)}>{b.status.toUpperCase()}</span>
                    </p>
                </div>
            ))}
        </div>
    );
};

export default MyBookings;