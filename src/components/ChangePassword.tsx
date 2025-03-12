import { useState } from 'react';
import './ChangePassword.css';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:7203/api/users/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            if (!response.ok) {
                throw new Error('Failed to change password');
            }

            setSuccess('Password changed successfully');
        } catch (error) {
            console.error('Error changing password:', error);
            setError('Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="change-password-container">
            <h2>Change Password</h2>
            <div className="form-group">
                <input
                    type="password"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-control"
                />
            </div>
            <button onClick={handleChangePassword} className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Changing...' : 'Change Password'}
            </button>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
        </div>
    );
};

export default ChangePassword;
