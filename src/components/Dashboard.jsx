import React, { useState, useEffect } from 'react';
import { patientService } from '../services/api';
import PatientDetails from './PatientDetails';
import SummaryDisplay from './SummaryDisplay';
import ExportButtons from './ExportButtons';
import BillingCard from './BillingCard';
import EmailNotifications from './EmailNotifications';
import { chatService } from '../services/chatApi'; // ADD THIS IMPORT
import './Dashboard.css';
import './AdminChat.css';
import './AdminChat.css'; // ADD THIS IMPORT

const Dashboard = ({ user, onLogout }) => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPatient, setNewPatient] = useState({
        patientId: '',
        name: '',
        age: '',
        gender: '',
        diagnosis: '',
        admissionDate: '',
        medications: '',
        vitals: '',
        labResults: '',
        doctorNotes: ''
    });

    // ========== CHAT STATES ==========
    const [showChatPanel, setShowChatPanel] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [selectedPatientChat, setSelectedPatientChat] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newChatMessage, setNewChatMessage] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingChat, setLoadingChat] = useState(false);

    // Load patients on component mount
    useEffect(() => {
        loadPatients();
    }, []);

    // ========== CHAT FUNCTIONS ==========
    useEffect(() => {
        // Load chat data when component mounts
        loadConversations();
        loadUnreadCount();
        
        // Refresh every 5 seconds
        const interval = setInterval(() => {
            console.log('🔄 Refreshing chat data...');
            loadConversations();
            loadUnreadCount();
            if (selectedPatientChat) {
                loadPatientConversation(selectedPatientChat);
            }
        }, 5000);
        
        return () => clearInterval(interval);
    }, [selectedPatientChat]);

    const loadConversations = async () => {
        try {
            console.log('📥 Loading conversations...');
            const data = await chatService.getAdminConversations();
            console.log('✅ Conversations loaded:', data);
            setConversations(data || []);
        } catch (error) {
            console.error('❌ Error loading conversations:', error);
        }
    };

    const loadPatientConversation = async (patientId) => {
        try {
            setLoadingChat(true);
            console.log('📥 Loading conversation for patient:', patientId);
            const messages = await chatService.getPatientConversation(patientId);
            console.log('✅ Messages loaded:', messages);
            setChatMessages(messages || []);
            setSelectedPatientChat(patientId);
        } catch (error) {
            console.error('❌ Error loading conversation:', error);
        } finally {
            setLoadingChat(false);
        }
    };

    const loadUnreadCount = async () => {
        try {
            const count = await chatService.getUnreadCount(user?.id || 1);
            setUnreadCount(count);
        } catch (error) {
            console.error('❌ Error loading unread count:', error);
        }
    };

    const handleSendChatMessage = async () => {
        if (!newChatMessage.trim() || !selectedPatientChat) return;
        
        const messageData = {
            senderId: user?.id || 1,
            senderName: user?.name || 'Admin',
            senderRole: 'admin',
            receiverId: 0,
            message: newChatMessage,
            patientId: selectedPatientChat
        };
        
        try {
            console.log('📤 Sending message:', messageData);
            await chatService.sendMessage(messageData);
            setNewChatMessage('');
            await loadPatientConversation(selectedPatientChat);
            await loadUnreadCount();
        } catch (error) {
            console.error('❌ Error sending message:', error);
            alert('Failed to send message');
        }
    };

    // ========== PATIENT FUNCTIONS ==========
    const loadPatients = async () => {
        setLoading(true);
        try {
            const response = await patientService.getAllPatients();
            setPatients(response.data);
        } catch (error) {
            console.error('Error loading patients:', error);
            setPatients([
                { id: 1, patientId: 'P001', name: 'John Doe', age: 65, diagnosis: 'Hypertension', status: 'Active' },
                { id: 2, patientId: 'P002', name: 'Jane Smith', age: 45, diagnosis: 'Pneumonia', status: 'Discharged' },
                { id: 3, patientId: 'P003', name: 'Robert Johnson', age: 72, diagnosis: 'Heart Failure', status: 'Active' },
                { id: 4, patientId: 'P004', name: 'Maria Garcia', age: 35, diagnosis: 'Bronchitis', status: 'Active' },
                { id: 5, patientId: 'P005', name: 'David Kim', age: 52, diagnosis: 'Asthma', status: 'Active' }
            ]);
        }
        setLoading(false);
    };

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setSummary(null);
    };

    const handleGenerateSummary = async () => {
        if (!selectedPatient) return;
        
        setLoading(true);
        try {
            const response = await patientService.generateSummary(selectedPatient.patientId);
            setSummary(response.data);
        } catch (error) {
            console.error('Error generating summary:', error);
        }
        setLoading(false);
    };

    const handleAddPatient = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await patientService.addPatient(newPatient);
            if (response.status === 201) {
                await loadPatients();
                setShowAddForm(false);
                setNewPatient({
                    patientId: '',
                    name: '',
                    age: '',
                    gender: '',
                    diagnosis: '',
                    admissionDate: '',
                    medications: '',
                    vitals: '',
                    labResults: '',
                    doctorNotes: ''
                });
            }
        } catch (error) {
            console.error('Error adding patient:', error);
        }
        setLoading(false);
    };

    const filteredPatients = patients.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const userRole = user?.role || 'admin';

    // Format timestamp
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    };

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-left">
                    <h1>🏥 Smart Discharge Summary</h1>
                    <p>Welcome, {user?.name || 'Doctor'}! <span className="role-badge">({userRole})</span></p>
                </div>
                <div className="header-right">
                    {/* CHAT BUTTON - ADDED HERE */}
                    <button 
                        className={`chat-notification-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
                        onClick={() => setShowChatPanel(!showChatPanel)}
                    >
                        💬 Chat 
                        {unreadCount > 0 && (
                            <span className="unread-badge">{unreadCount}</span>
                        )}
                    </button>
                    
                    <span className="user-badge">{user?.email || 'doctor@hospital.com'}</span>
                    <button onClick={onLogout} className="logout-btn">Logout</button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>Total Patients</h3>
                        <p className="stat-number">{patients.length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🏥</div>
                    <div className="stat-info">
                        <h3>Active</h3>
                        <p className="stat-number">{patients.filter(p => p.status === 'Active').length || 4}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-info">
                        <h3>Today's Summaries</h3>
                        <p className="stat-number">5</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                        <h3>Avg. Stay</h3>
                        <p className="stat-number">4.2d</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="dashboard-main">
                {/* Left Panel - Patient List */}
                <div className="patient-list-panel">
                    <div className="panel-header">
                        <h2>Patients</h2>
                        <button 
                            className="add-patient-btn"
                            onClick={() => setShowAddForm(true)}
                        >
                            + Add New
                        </button>
                    </div>
                    
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {loading && <div className="loading-spinner">Loading...</div>}

                    <div className="patient-list">
                        {filteredPatients.map(patient => (
                            <div 
                                key={patient.id}
                                className={`patient-card ${selectedPatient?.id === patient.id ? 'selected' : ''}`}
                                onClick={() => handlePatientSelect(patient)}
                            >
                                <div className="patient-card-header">
                                    <span className="patient-id">{patient.patientId}</span>
                                    <span className="patient-age">{patient.age}y</span>
                                </div>
                                <div className="patient-name">{patient.name}</div>
                                <div className="patient-diagnosis">{patient.diagnosis}</div>
                            </div>
                        ))}
                    </div>

                    {/* Upcoming Discharges */}
                    <div className="upcoming-discharges">
                        <h3>📅 Discharging Today</h3>
                        <div className="discharge-list">
                            <div className="discharge-item">
                                <span>Robert Johnson</span>
                                <span className="time">4:00 PM</span>
                            </div>
                            <div className="discharge-item">
                                <span>Maria Garcia</span>
                                <span className="time">6:00 PM</span>
                            </div>
                            <div className="discharge-item">
                                <span>David Kim</span>
                                <span className="time">7:30 PM</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Patient Details & Summary */}
                <div className="details-panel">
                    {selectedPatient ? (
                        <>
                            <PatientDetails patient={selectedPatient} />
                            
                            <div className="action-buttons">
                                <button 
                                    className="generate-btn"
                                    onClick={handleGenerateSummary}
                                    disabled={loading}
                                >
                                    {loading ? 'Generating...' : '🚀 Generate Summary'}
                                </button>
                            </div>

                            {summary && (
                                <>
                                    <SummaryDisplay summary={summary} />
                                    <ExportButtons 
                                        patientId={selectedPatient.patientId}
                                        summary={summary}
                                    />
                                </>
                            )}
                            
                            {/* Billing Card */}
                            <BillingCard 
                                patient={selectedPatient}
                                onUpdate={() => {
                                    console.log('Billing updated');
                                }}
                            />

                            {/* Email Notifications */}
                            <EmailNotifications patient={selectedPatient} />
                        </>
                    ) : (
                        <div className="no-selection">
                            <h3>Select a patient to view details</h3>
                            <p>Click on any patient from the list to start</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ========== CHAT PANEL - ADDED HERE ========== */}
            {showChatPanel && (
                <div className="chat-panel">
                    <div className="chat-panel-header">
                        <h3>Patient Conversations ({unreadCount} unread)</h3>
                        <button onClick={() => setShowChatPanel(false)}>✕</button>
                    </div>
                    
                    <div className="conversations-list">
                        {conversations.length > 0 ? (
                            conversations.map((conv, index) => (
                                <div 
                                    key={index}
                                    className={`conversation-item ${selectedPatientChat === conv.patientId ? 'active' : ''}`}
                                    onClick={() => loadPatientConversation(conv.patientId)}
                                >
                                    <div className="conv-header">
                                        <span className="patient-name">Patient {conv.patientId}</span>
                                        <span className="conv-time">
                                            {formatDate(conv.timestamp)}
                                        </span>
                                    </div>
                                    <div className="last-message">
                                        <strong>{conv.senderName}:</strong> {conv.message?.substring(0, 30)}...
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-conversations">No conversations yet</div>
                        )}
                    </div>
                    
                    {selectedPatientChat && (
                        <div className="chat-area">
                            <div className="chat-messages">
                                {loadingChat ? (
                                    <div className="loading">Loading messages...</div>
                                ) : chatMessages.length > 0 ? (
                                    chatMessages.map((msg, index) => (
                                        <div key={index} className={`chat-message ${msg.senderRole}`}>
                                            <div className="message-content">
                                                <p><strong>{msg.senderName}:</strong> {msg.message}</p>
                                                <span className="time">
                                                    {formatTime(msg.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-messages">No messages in this conversation</div>
                                )}
                            </div>
                            
                            <div className="chat-input-area">
                                <input
                                    type="text"
                                    value={newChatMessage}
                                    onChange={(e) => setNewChatMessage(e.target.value)}
                                    placeholder="Type reply..."
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                                />
                                <button onClick={handleSendChatMessage}>Send</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Add Patient Modal */}
            {showAddForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add New Patient</h2>
                        <form onSubmit={handleAddPatient}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Patient ID</label>
                                    <input
                                        type="text"
                                        value={newPatient.patientId}
                                        onChange={(e) => setNewPatient({...newPatient, patientId: e.target.value})}
                                        placeholder="e.g., P006"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={newPatient.name}
                                        onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Age</label>
                                    <input
                                        type="number"
                                        value={newPatient.age}
                                        onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select
                                        value={newPatient.gender}
                                        onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="form-group full-width">
                                    <label>Diagnosis</label>
                                    <input
                                        type="text"
                                        value={newPatient.diagnosis}
                                        onChange={(e) => setNewPatient({...newPatient, diagnosis: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Admission Date</label>
                                    <input
                                        type="date"
                                        value={newPatient.admissionDate}
                                        onChange={(e) => setNewPatient({...newPatient, admissionDate: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Medications</label>
                                    <textarea
                                        value={newPatient.medications}
                                        onChange={(e) => setNewPatient({...newPatient, medications: e.target.value})}
                                        rows="2"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Vitals</label>
                                    <textarea
                                        value={newPatient.vitals}
                                        onChange={(e) => setNewPatient({...newPatient, vitals: e.target.value})}
                                        rows="2"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Lab Results</label>
                                    <textarea
                                        value={newPatient.labResults}
                                        onChange={(e) => setNewPatient({...newPatient, labResults: e.target.value})}
                                        rows="2"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Doctor Notes</label>
                                    <textarea
                                        value={newPatient.doctorNotes}
                                        onChange={(e) => setNewPatient({...newPatient, doctorNotes: e.target.value})}
                                        rows="2"
                                    />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="save-btn" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Patient'}
                                </button>
                                <button 
                                    type="button" 
                                    className="cancel-btn"
                                    onClick={() => setShowAddForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;