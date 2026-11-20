import { useState, useEffect } from 'react';
import API from '../api/axios';

const StaffDashboard = () => {
    const [tab, setTab] = useState('assets');
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [newService, setNewService] = useState({
        name: '',
        description: '',
        category: '',
        pricePerDay: '',
    });

    const fetchServices = async () => {
        try {
            const res = await API.get('/service');
            setServices(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load assets');
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await API.get('/booking');
            setBookings(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load bookings');
        }
    };

    useEffect(() => {
        fetchServices();
        fetchBookings();
    }, []);

    const handleAddService = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await API.post('/service', {
                ...newService,
                pricePerDay: Number(newService.pricePerDay),
            });
            setMessage('Asset added successfully');
            setNewService({ name: '', description: '', category: '', pricePerDay: '' });
            fetchServices();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add asset');
        }
    };

    const handleMarkReturned = async (id) => {
        setError('');
        setMessage('');
        try {
            await API.put(`/booking/${id}`, { status: 'returned' });
            setMessage('Marked as returned');
            fetchBookings();
            fetchServices();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update booking');
        }
    };

    return (
        <div className="page-container">
            <h2>Staff Dashboard</h2>

            <div style={{ marginBottom: '20px' }}>
                <button className={`tab-btn ${tab === 'assets' ? 'active' : ''}`} onClick={() => setTab('assets')}>
                    Manage Assets
                </button>
                <button className={`tab-btn ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>
                    All Bookings
                </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-number">{services.length}</div>
                    <div className="stat-label">Total Assets</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{bookings.length}</div>
                    <div className="stat-label">Total Bookings</div>
                </div>
            </div>
            {tab === 'assets' && (
                <div>
                    <h3>Add New Asset</h3>
                    <form onSubmit={handleAddService} style={{ marginBottom: '20px' }}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={newService.name}
                            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                            required
                            style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '8px' }}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newService.description}
                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                            style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '8px' }}
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            value={newService.category}
                            onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                            style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '8px' }}
                        />
                        <input
                            type="number"
                            placeholder="Price per day"
                            value={newService.pricePerDay}
                            onChange={(e) => setNewService({ ...newService, pricePerDay: e.target.value })}
                            required
                            style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '8px' }}
                        />
                        <button type="submit">Add Asset</button>
                    </form>

                    <h3>All Assets</h3>
                    <p style={{ fontSize: '0.85rem', color: '#777' }}>
                        Note: only Admin can delete assets.
                    </p>
                    {services.map((s) => (
                        <div key={s._id} className="card">
                            <strong>{s.name}</strong> — ₹{s.pricePerDay}/day —{' '}
                            {s.isAvailable ? 'Available' : 'Rented out'}
                        </div>
                    ))}
                </div>
            )}

            {tab === 'bookings' && (
                <div>
                    <h3>All Bookings</h3>
                    {bookings.map((b) => (
                        <div key={b._id} className="card">
                            <p><strong>Customer:</strong> {b.customer?.user?.name} ({b.customer?.user?.email})</p>
                            <p><strong>Asset:</strong> {b.service?.name}</p>
                            <p><strong>Dates:</strong> {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}</p>
                            <p><strong>Total:</strong> ₹{b.totalPrice}</p>
                            <p><strong>Status:</strong> {b.status}</p>
                            {b.status !== 'returned' && (
                                <button onClick={() => handleMarkReturned(b._id)}>Mark as Returned</button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StaffDashboard;