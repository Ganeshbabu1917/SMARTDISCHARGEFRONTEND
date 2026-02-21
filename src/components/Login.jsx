import React, { useState } from 'react';
import { authService } from '../services/authApi';
import './Login.css';

const Login = ({ onLogin, onSwitchToSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            console.log("🔑 Attempting login with:", email);
            const response = await authService.login(email, password);
            
            console.log("📨 Login response:", response);
            
            if (response.status === 200) {
                const userData = response.data;
                console.log("✅ User data from backend:", userData);
                
                // Ensure role is set (if backend doesn't send it)
                if (!userData.role) {
                    // Assign role based on email for testing
                    if (email.includes('admin')) {
                        userData.role = 'admin';
                    } else if (email.includes('doctor')) {
                        userData.role = 'doctor';
                    } else {
                        userData.role = 'patient';
                    }
                    console.log("🛠️ Assigned role based on email:", userData.role);
                }
                
                // Save to localStorage
                localStorage.setItem('currentUser', JSON.stringify(userData));
                console.log("💾 Saved to localStorage:", userData);
                
                // Call onLogin
                onLogin(true);
            } else {
                setError(response.data?.message || 'Login failed');
            }
        } catch (error) {
            console.error("❌ Login error:", error);
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
                    <p>Welcome Back! Login to your account</p>
                </div>
                
                <form onSubmit={handleSubmit}>
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
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>Don't have an account? 
                        <button onClick={onSwitchToSignup} className="switch-btn">
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;