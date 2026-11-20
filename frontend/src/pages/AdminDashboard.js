import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('assets');
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [newService, setNewService] = useState({
        name: '',
        description: '',
        category: '',
        pricePerDay: '',
    });
    const [editingService, setEditingService] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'staff' });

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

    const fetchUsers = async () => {
        try {
            const res = await API.get('/users');
            setUsers(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load users');
        }
    };


    useEffect(() => {
        fetchServices();
        fetchBookings();
        fetchUsers();
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

    const handleDeleteService = async (id) => {
        setError('');
        setMessage('');
        try {
            await API.delete(`/service/${id}`);
            setMessage('Asset deleted');
            fetchServices();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete asset');
        }
    };
    const handleUpdateService = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            await API.put(`/service/${editingService._id}`, {
                name: editingService.name,
                description: editingService.description,
                category: editingService.category,
                pricePerDay: Number(editingService.pricePerDay),
                isAvailable: editingService.isAvailable,
            });

            setMessage('Asset updated successfully');
            setEditingService(null);
            fetchServices();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update asset');
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
    const handleDeleteBooking = async (id) => {
        setError('');
        setMessage('');

        try {
            await API.delete(`/booking/${id}`);
            setMessage('Returned booking deleted successfully');
            fetchBookings();
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to delete booking'
            );
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await API.post('/users', newUser);
            setMessage('Staff/Admin account created');
            setNewUser({ name: '', email: '', password: '', role: 'staff' });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
        }
    };

    const handleDeleteUser = async (id) => {
        setError('');
        setMessage('');
        try {
            await API.delete(`/users/${id}`);
            setMessage('User deleted');
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
        }
    };
    const adminCount = users.filter(u => u.role === 'admin').length;
    const staffCount = users.filter(u => u.role === 'staff').length;
    const customerCount = users.filter(u => u.role === 'customer').length;
    return (
        <div className="page-container">
            <h2>Admin Dashboard</h2>

            <div style={{ marginBottom: '20px' }}>
                <button className={`tab-btn ${tab === 'assets' ? 'active' : ''}`} onClick={() => setTab('assets')}>
                    Manage Assets
                </button>
                <button className={`tab-btn ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>
                    All Bookings
                </button>
                <button className={`tab-btn ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
                    Manage Users
                </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}
            <div className="stats-row">

                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-number">{services.length}</div>
                        <div className="stat-label">Total Assets</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{bookings.length}</div>
                        <div className="stat-label">Total Bookings</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{adminCount}</div>
                        <div className="stat-label">Admins</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{staffCount}</div>
                        <div className="stat-label">Staff</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{customerCount}</div>
                        <div className="stat-label">Customers</div>
                    </div>
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
                    {services.map((s) => (
                        <div key={s._id} className="card">
                            <strong>{s.name}</strong> — ₹{s.pricePerDay}/day —{' '}
                            {s.isAvailable ? 'Available' : 'Rented out'}

                            <button
                                onClick={() => setEditingService({ ...s })}
                                style={{ marginLeft: '10px' }}
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDeleteService(s._id)}
                                className="btn-danger"
                                style={{ marginLeft: '10px' }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {editingService && (
                <div className="card" style={{ marginTop: '20px' }}>
                    <h3>Edit Asset</h3>

                    <form onSubmit={handleUpdateService}>

                        <input
                            type="text"
                            placeholder="Name"
                            value={editingService.name}
                            onChange={(e) =>
                                setEditingService({
                                    ...editingService,
                                    name: e.target.value
                                })
                            }
                            required
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '8px',
                                marginBottom: '8px'
                            }}
                        />

                        <input
                            type="text"
                            placeholder="Description"
                            value={editingService.description || ''}
                            onChange={(e) =>
                                setEditingService({
                                    ...editingService,
                                    description: e.target.value
                                })
                            }
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '8px',
                                marginBottom: '8px'
                            }}
                        />

                        <input
                            type="text"
                            placeholder="Category"
                            value={editingService.category || ''}
                            onChange={(e) =>
                                setEditingService({
                                    ...editingService,
                                    category: e.target.value
                                })
                            }
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '8px',
                                marginBottom: '8px'
                            }}
                        />

                        <input
                            type="number"
                            placeholder="Price per day"
                            value={editingService.pricePerDay}
                            onChange={(e) =>
                                setEditingService({
                                    ...editingService,
                                    pricePerDay: e.target.value
                                })
                            }
                            required
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '8px',
                                marginBottom: '8px'
                            }}
                        />

                        <select
                            value={editingService.isAvailable ? 'available' : 'rented'}
                            onChange={(e) =>
                                setEditingService({
                                    ...editingService,
                                    isAvailable: e.target.value === 'available'
                                })
                            }
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '8px',
                                marginBottom: '10px'
                            }}
                        >
                            <option value="available">Available</option>
                            <option value="rented">Rented out</option>
                        </select>

                        <button type="submit">
                            Update Asset
                        </button>

                        <button
                            type="button"
                            onClick={() => setEditingService(null)}
                            className="btn-secondary"
                            style={{ marginLeft: '10px' }}
                        >
                            Cancel
                        </button>

                    </form>
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
                            {b.status !== 'returned' ? (
                                <button onClick={() => handleMarkReturned(b._id)}>
                                    Mark as Returned
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleDeleteBooking(b._id)}
                                    className="btn-danger"
                                    style={{ marginLeft: '10px' }}
                                >
                                    Delete Record
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {tab === 'users' && (
                <div>
                    <h3>Add New Staff/Admin</h3>
                    <form onSubmit={handleAddUser} style={{ marginBottom: '20px' }}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            required
                            style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '8px' }}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            required
                            style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '8px' }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            required
                            style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '8px' }}
                        />

                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '8px' }}
                        >
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button type="submit">Create Account</button>
                    </form>

                    <h3>All Users</h3>
                    {users.map((u) => (
                        <div key={u._id} className="card">
                            <strong>{u.name}</strong> — {u.email} —{' '}
                            <span className={`badge ${u.role === 'admin' ? 'badge-rented' : 'badge-available'}`}>
                                {u.role.toUpperCase()}
                            </span>
                            {u._id !== user._id && (
                                <button onClick={() => handleDeleteUser(u._id)} className="btn-danger" style={{ marginLeft: '10px' }}>
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;