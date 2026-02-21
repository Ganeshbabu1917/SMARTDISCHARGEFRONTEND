import React, { useState, useEffect } from 'react';
import { patientService } from '../services/api';
import { billingService } from '../services/billingApi';
import SummaryDisplay from './SummaryDisplay';
import { chatService } from '../services/chatApi';
import './PatientDashboard.css';

const PatientDashboard = ({ user, onLogout }) => {
    const [myDetails, setMyDetails] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [healthStatus, setHealthStatus] = useState([]);
    const [billing, setBilling] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedTab, setSelectedTab] = useState('dashboard');
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Chat states
    const [chatMessages, setChatMessages] = useState([]);
    const [newChatMessage, setNewChatMessage] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);

    // Get user info
    const userEmail = user?.email || '';
    const userName = user?.name || userEmail.split('@')[0] || 'Patient';

    // Load patient data
    useEffect(() => {
        loadPatientData();
        loadMockData();
    }, []);

    // Load chat messages when patient details are loaded
    useEffect(() => {
        if (myDetails?.patientId) {
            loadChatMessages();
            
            // Refresh chat every 10 seconds
            const interval = setInterval(() => {
                loadChatMessages();
            }, 10000);
            
            return () => clearInterval(interval);
        }
    }, [myDetails]);

    const loadPatientData = async () => {
        setLoading(true);
        try {
            const response = await patientService.getPatient('P001');
            if (response.data) {
                response.data.name = userName;
                setMyDetails(response.data);
            }
            
            const billResponse = await billingService.getBillingByPatientId('P001');
            if (billResponse.status === 200) {
                setBilling(billResponse.data);
            }
        } catch (error) {
            console.error('Error loading patient data:', error);
            setMyDetails({
                id: 1,
                patientId: 'P001',
                name: userName,
                age: 45,
                gender: 'Male',
                diagnosis: 'Hypertension',
                admissionDate: '2026-02-15',
                dischargeDate: null,
                medications: 'Metformin 500mg - Twice daily\nLisinopril 10mg - Once daily',
                email: userEmail
            });
        }
        setLoading(false);
    };

    const loadMockData = () => {
        setAppointments([
            { id: 1, doctor: 'Dr. Smith', date: '2026-02-22', time: '10:00 AM', status: 'accepted' },
            { id: 2, doctor: 'Dr. Johnson', date: '2026-02-25', time: '2:30 PM', status: 'pending' },
            { id: 3, doctor: 'Dr. Williams', date: '2026-02-28', time: '11:15 AM', status: 'pending' }
        ]);

        setHealthStatus([
            { date: '2026-02-20', bp: '125/85', sugar: '140', weight: '75kg', feeling: 'Good' },
            { date: '2026-02-19', bp: '130/88', sugar: '145', weight: '75.2kg', feeling: 'Okay' },
            { date: '2026-02-18', bp: '135/90', sugar: '150', weight: '75.5kg', feeling: 'Tired' },
            { date: '2026-02-17', bp: '140/92', sugar: '155', weight: '75.8kg', feeling: 'Not well' },
        ]);
    };

    // ========== CHAT FUNCTIONS ==========
    const loadChatMessages = async () => {
        if (!myDetails?.patientId) return;
        
        try {
            const messages = await chatService.getPatientMessages(myDetails.patientId);
            setChatMessages(messages);
        } catch (error) {
            console.error('Error loading chat messages:', error);
        }
    };

    const handleSendChatMessage = async (e) => {
        e.preventDefault();
        
        if (!newChatMessage.trim() || !myDetails?.patientId || sendingMessage) return;
        
        setSendingMessage(true);
        
        const messageData = {
            senderId: myDetails?.id || 1,
            senderName: myDetails?.name || userName,
            senderRole: 'patient',
            receiverId: 1, // Admin ID (usually 1)
            message: newChatMessage,
            patientId: myDetails.patientId
        };
        
        try {
            await chatService.sendMessage(messageData);
            setNewChatMessage('');
            await loadChatMessages(); // Reload messages
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSendingMessage(false);
        }
    };

    // ========== OTHER FUNCTIONS ==========
    const handleRequestAppointment = () => {
        const newApt = {
            id: appointments.length + 1,
            doctor: 'Dr. Smith',
            date: '2026-03-01',
            time: '11:00 AM',
            status: 'pending'
        };
        setAppointments([...appointments, newApt]);
        alert('✅ Appointment requested! Waiting for admin approval.');
    };

    const handleUpdateHealth = () => {
        const today = new Date().toISOString().split('T')[0];
        const bp = prompt('Enter your BP (e.g., 120/80):', '120/80');
        if (!bp) return;
        const sugar = prompt('Enter your blood sugar:', '140');
        if (!sugar) return;
        
        const newStatus = {
            date: today,
            bp: bp,
            sugar: sugar,
            weight: myDetails?.weight || '75kg',
            feeling: 'Updated'
        };
        
        setHealthStatus([newStatus, ...healthStatus]);
        alert('✅ Health status updated!');
    };

    const handleGenerateSummary = async () => {
        if (!myDetails) return;
        setLoading(true);
        try {
            const response = await patientService.generateSummary(myDetails.patientId);
            setSummary(response.data);
            setSelectedTab('summary');
        } catch (error) {
            console.error('Error generating summary:', error);
        }
        setLoading(false);
    };

    // Format timestamp
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="patient-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-left">
                    <h1>🏥 Patient Dashboard</h1>
                    <p>Welcome, {myDetails?.name || userName}!</p>
                </div>
                <div className="header-right">
                    <span className="user-badge">{userEmail}</span>
                    <button onClick={onLogout} className="logout-btn">Logout</button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <button className="quick-btn" onClick={handleRequestAppointment}>
                    📅 Request Appointment
                </button>
                <button className="quick-btn" onClick={handleUpdateHealth}>
                    📊 Update Health Status
                </button>
                <button className="quick-btn" onClick={handleGenerateSummary}>
                    📋 View Discharge Summary
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button 
                    className={`tab-btn ${selectedTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('dashboard')}
                >
                    🏠 Dashboard
                </button>
                <button 
                    className={`tab-btn ${selectedTab === 'appointments' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('appointments')}
                >
                    📅 My Appointments
                </button>
                <button 
                    className={`tab-btn ${selectedTab === 'health' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('health')}
                >
                    📊 Health Status
                </button>
                <button 
                    className={`tab-btn ${selectedTab === 'billing' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('billing')}
                >
                    💰 Billing
                </button>
                <button 
                    className={`tab-btn ${selectedTab === 'chat' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('chat')}
                >
                    💬 Chat with Doctor
                    {chatMessages.filter(m => !m.isRead && m.senderRole === 'admin').length > 0 && (
                        <span className="chat-badge">
                            {chatMessages.filter(m => !m.isRead && m.senderRole === 'admin').length}
                        </span>
                    )}
                </button>
                <button 
                    className={`tab-btn ${selectedTab === 'summary' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('summary')}
                >
                    📋 My Summary
                </button>
            </div>

            {/* Content based on tab */}
            <div className="tab-content">
                {/* Dashboard Tab */}
                {selectedTab === 'dashboard' && (
                    <div className="dashboard-tab">
                        <div className="welcome-card">
                            <h2>Welcome back, {myDetails?.name || userName}!</h2>
                            <p>Your next appointment: <strong>Tomorrow at 10:00 AM</strong></p>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">📅</div>
                                <div className="stat-info">
                                    <h3>Appointments</h3>
                                    <p className="stat-number">{appointments.length}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">💰</div>
                                <div className="stat-info">
                                    <h3>Due Amount</h3>
                                    <p className="stat-number">₹{billing?.dueAmount || '2,500'}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">❤️</div>
                                <div className="stat-info">
                                    <h3>Last BP</h3>
                                    <p className="stat-number">{healthStatus[0]?.bp || '125/85'}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📊</div>
                                <div className="stat-info">
                                    <h3>Blood Sugar</h3>
                                    <p className="stat-number">{healthStatus[0]?.sugar || '140'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="recent-section">
                            <h3>Recent Health Updates</h3>
                            <div className="health-list">
                                {healthStatus.slice(0, 3).map((status, index) => (
                                    <div key={index} className="health-item">
                                        <span className="date">{status.date}</span>
                                        <span className="bp">BP: {status.bp}</span>
                                        <span className="sugar">Sugar: {status.sugar}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Appointments Tab */}
                {selectedTab === 'appointments' && (
                    <div className="appointments-tab">
                        <div className="tab-header">
                            <h2>My Appointments</h2>
                            <button className="request-btn" onClick={handleRequestAppointment}>
                                + Request New
                            </button>
                        </div>
                        <div className="appointments-list">
                            {appointments.map(apt => (
                                <div key={apt.id} className={`appointment-card ${apt.status}`}>
                                    <div className="apt-header">
                                        <span className="doctor">Dr. {apt.doctor}</span>
                                        <span className={`status-badge ${apt.status}`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                    <div className="apt-details">
                                        <span>📅 {apt.date}</span>
                                        <span>⏰ {apt.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Health Status Tab */}
                {selectedTab === 'health' && (
                    <div className="health-tab">
                        <div className="tab-header">
                            <h2>Daily Health Tracking</h2>
                            <button className="update-btn" onClick={handleUpdateHealth}>
                                + Update Today
                            </button>
                        </div>
                        <div className="health-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Blood Pressure</th>
                                        <th>Blood Sugar</th>
                                        <th>Weight</th>
                                        <th>Feeling</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {healthStatus.map((status, index) => (
                                        <tr key={index}>
                                            <td>{status.date}</td>
                                            <td>{status.bp}</td>
                                            <td>{status.sugar}</td>
                                            <td>{status.weight}</td>
                                            <td>{status.feeling}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Billing Tab */}
                {selectedTab === 'billing' && (
                    <div className="billing-tab">
                        <h2>My Bills</h2>
                        {billing ? (
                            <div className="billing-details">
                                <div className="bill-summary">
                                    <div className="bill-row">
                                        <span>Total Amount:</span>
                                        <span>₹{billing.totalAmount}</span>
                                    </div>
                                    <div className="bill-row">
                                        <span>Paid Amount:</span>
                                        <span>₹{billing.paidAmount}</span>
                                    </div>
                                    <div className="bill-row due">
                                        <span>Due Amount:</span>
                                        <span>₹{billing.dueAmount}</span>
                                    </div>
                                    <div className="bill-status">
                                        Status: <span className={`status ${billing.paymentStatus}`}>
                                            {billing.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                                <button className="pay-btn">Pay Now</button>
                            </div>
                        ) : (
                            <p>No billing information found</p>
                        )}
                    </div>
                )}

                {/* Chat Tab - UPDATED WITH REAL CHAT */}
                {selectedTab === 'chat' && (
                    <div className="chat-tab">
                        <h2>Chat with Doctor</h2>
                        <div className="chat-container">
                            <div className="messages-list">
                                {chatMessages.length > 0 ? (
                                    chatMessages.map((msg, index) => (
                                        <div key={index} className={`message ${msg.senderRole}`}>
                                            <div className="message-content">
                                                <p><strong>{msg.senderName}:</strong> {msg.message}</p>
                                                <span className="time">
                                                    {formatTime(msg.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-messages">
                                        <p>No messages yet. Start a conversation with your doctor!</p>
                                    </div>
                                )}
                            </div>
                            
                            <form className="chat-input" onSubmit={handleSendChatMessage}>
                                <input
                                    type="text"
                                    value={newChatMessage}
                                    onChange={(e) => setNewChatMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    disabled={sendingMessage}
                                />
                                <button 
                                    type="submit" 
                                    disabled={sendingMessage || !newChatMessage.trim()}
                                >
                                    {sendingMessage ? 'Sending...' : 'Send'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Summary Tab */}
                {selectedTab === 'summary' && summary && (
                    <div className="summary-tab">
                        <SummaryDisplay summary={summary} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;