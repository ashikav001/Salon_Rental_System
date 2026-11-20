import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
const Assets = () => {
    const [assets, setAssets] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
const { user } = useAuth();

    const fetchAssets = async () => {
        try {
            const res = await API.get('/service');
            setAssets(res.data);
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to load salon assets'
            );
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    return (
        <div className="page-container">
            <h2>Available Salon Assets</h2>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <div className="assets-container">
                {assets.length === 0 && !error && (
                    <p>No salon assets available.</p>
                )}

                {assets.map((asset) => (
                    <div className="card" key={asset._id}>
                        <h3>{asset.name}</h3>

                        <p>{asset.description}</p>

                        <p>
                            <strong>Category:</strong> {asset.category}
                        </p>

                        <p>
                            <strong>Price per day:</strong> ₹
                            {asset.pricePerDay}
                        </p>

                        <p>
                            <strong>Status:</strong>{' '}
                            {asset.isAvailable
                                ? 'Available'
                                : 'Rented'}
                        </p>

                        {asset.isAvailable && (
    <button
        onClick={() => {
            if (!user) {
                navigate('/login');
                return;
            }

            if (user.role !== 'customer') {
                alert('Only customers can book assets.');
                return;
            }

            // Booking form will be added here
            console.log('Booking asset:', asset);
        }}
    >
        Book Now
    </button>
)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Assets;