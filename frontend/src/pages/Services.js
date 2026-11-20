import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Services = () => {
    const [services, setServices] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { user } = useAuth();

    const fetchServices = async () => {
        try {
            const res = await API.get('/service');
            setServices(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load services');
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleBook = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const res = await API.post('/booking', {
                serviceId: selectedService._id,
                startDate,
                endDate,
            });
            setMessage(`Booked successfully! Total price: ₹${res.data.totalPrice}`);
            setSelectedService(null);
            setStartDate('');
            setEndDate('');
            fetchServices(); // refresh list so availability updates
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        }
    };

    return (
        <div className="page-container">
            <h2>Available Salon Assets</h2>
            <p>Logged in as: {user?.name} ({user?.role})</p>

            {error && <div className="alert alert-error">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            {services.map((service) => (
                <div key={service._id} className="card">
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <p>Category: {service.category}</p>
                    <p>Price per day: ₹{service.pricePerDay}</p>
                    <p>
                        <span className={`badge ${service.isAvailable ? 'badge-available' : 'badge-rented'}`}>
                            {service.isAvailable ? 'Available' : 'Rented out'}
                        </span>
                    </p>
                    {service.isAvailable && (
                        <button onClick={() => setSelectedService(service)}>Book this</button>
                    )}
                </div>
            ))}

            {selectedService && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Book: {selectedService.name}</h3>
                        <form onSubmit={handleBook}>
                            <div className="form-group">
                                <label>Start Date</label>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>End Date</label>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                            </div>
                            <button type="submit" style={{ marginRight: '10px' }}>Confirm Booking</button>
                            <button type="button" className="btn-secondary" onClick={() => setSelectedService(null)}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;