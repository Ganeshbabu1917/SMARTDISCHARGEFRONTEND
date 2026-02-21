import React, { useState } from 'react';
import { authService } from '../services/authApi';
import './Login.css';

const Signup = ({ onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('patient');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            console.log("📝 Signup attempt:", { name, email, role });
            const response = await authService.signup(name, email, password, role);
            console.log("📨 Signup response:", response);
            
            if (response.status === 201) {
                setSuccess('Account created successfully! Please login.');
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setRole('patient');
                
                setTimeout(() => {
                    onSwitchToLogin();
                }, 2000);
            } else {
                setError(response.data?.message || 'Signup failed');
            }
        } catch (error) {
            console.error("❌ Signup error:", error);
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-header">
                    <h1>🏥 Smart Discharge</h1>
                    <p>Create a new account</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>I am a</label>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                            className="role-select"
                            style={{
                                width: '100%',
                                padding: '12px 15px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '10px',
                                fontSize: '16px'
                            }}
                            required
                        >
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimum 6 characters"
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your password"
                            required
                        />
                    </div>
                    
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>Already have an account? 
                        <button onClick={onSwitchToLogin} className="switch-btn">
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;