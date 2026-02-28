import React, { useState } from 'react';
import { authService } from '../services/authApi';
import './Login.css';

const Signup = ({ onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');
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
        
        if (!age || age < 1 || age > 120) {
            setError('Please enter a valid age');
            return;
        }
        
        if (!gender) {
            setError('Please select your gender');
            return;
        }
        
        if (!phone) {
            setError('Please enter your phone number');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            // Create patient data object with ALL fields
            const patientData = {
                name: name,
                email: email,
                password: password,
                age: parseInt(age),
                gender: gender,
                phone: phone,
                address: address,
                bloodGroup: bloodGroup,
                emergencyContact: emergencyContact,
                role: 'patient' // Force role to patient
            };
            
            console.log("📝 Signup attempt with ALL details:", patientData);
            
            // Call updated signup method with all fields
            const response = await authService.signup(patientData);
            console.log("📨 Signup response:", response);
            
            if (response.status === 201) {
                setSuccess('Account created successfully! Redirecting to login...');
                
                // Clear form
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setAge('');
                setGender('');
                setPhone('');
                setAddress('');
                setBloodGroup('');
                setEmergencyContact('');
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    onSwitchToLogin();
                }, 2000);
            } else {
                setError(response.data?.message || 'Signup failed');
            }
        } catch (error) {
            console.error("❌ Signup error:", error);
            setError(error.response?.data?.message || 'Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box" style={{ maxWidth: '500px' }}>
                <div className="auth-header">
                    <h1>🏥 Smart Discharge</h1>
                    <p>Create a new patient account</p>
                </div>
                
                <form onSubmit={handleSubmit} style={{ maxHeight: '70vh', overflowY: 'auto', padding: '10px' }}>
                    {/* Basic Info Section */}
                    <h3 style={{ color: '#4a5568', marginBottom: '15px' }}>📋 Basic Information</h3>
                    
                    <div className="input-group">
                        <label>Full Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    
                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div className="input-group">
                            <label>Age *</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="Your age"
                                min="1"
                                max="120"
                                required
                            />
                        </div>
                        
                        <div className="input-group">
                            <label>Gender *</label>
                            <select 
                                value={gender} 
                                onChange={(e) => setGender(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '10px',
                                    fontSize: '16px'
                                }}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div className="input-group">
                            <label>Phone Number *</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Your contact number"
                                required
                            />
                        </div>
                        
                        <div className="input-group">
                            <label>Blood Group</label>
                            <select 
                                value={bloodGroup} 
                                onChange={(e) => setBloodGroup(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '10px',
                                    fontSize: '16px'
                                }}
                            >
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="input-group">
                        <label>Address</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Your full address"
                            rows="2"
                            style={{
                                width: '100%',
                                padding: '12px 15px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '10px',
                                fontSize: '16px',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Emergency Contact</label>
                        <input
                            type="text"
                            value={emergencyContact}
                            onChange={(e) => setEmergencyContact(e.target.value)}
                            placeholder="Emergency contact name and number"
                        />
                    </div>
                    
                    {/* Security Section */}
                    <h3 style={{ color: '#4a5568', margin: '20px 0 15px' }}>🔒 Security</h3>
                    
                    <div className="input-group">
                        <label>Password *</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimum 6 characters"
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Confirm Password *</label>
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
                    
                    <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: '20px' }}>
                        {loading ? 'Creating Account...' : 'Create Account'}
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