import React, { useState } from 'react';
import { emailService } from '../services/emailApi';
import './EmailNotifications.css';

const EmailNotifications = ({ patient }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState({
        doctorName: '',
        date: '',
        time: ''
    });

    if (!patient?.email) {
        return (
            <div className="email-notification warning">
                ⚠️ No email address found for this patient
            </div>
        );
    }

    const handleSendSummary = async () => {
        setLoading(true);
        try {
            const response = await emailService.sendDischargeSummary(patient.patientId);
            setMessage({ type: 'success', text: response.data || '✅ Discharge summary sent!' });
        } catch (error) {
            setMessage({ type: 'error', text: '❌ Failed to send email' });
        }
        setLoading(false);
        setTimeout(() => setMessage(''), 5000);
    };

    const handleSendPaymentReminder = async () => {
        setLoading(true);
        try {
            // ✅ FIXED: Removed the extra parameters
            const response = await emailService.sendPaymentReminder(patient.patientId);
            setMessage({ type: 'success', text: response.data || '✅ Payment reminder sent!' });
        } catch (error) {
            setMessage({ type: 'error', text: '❌ Failed to send email' });
        }
        setLoading(false);
        setTimeout(() => setMessage(''), 5000);
    };

    const handleSendAppointmentReminder = async () => {
        if (!appointmentDetails.doctorName || !appointmentDetails.date || !appointmentDetails.time) {
            setMessage({ type: 'error', text: '❌ Please fill all fields' });
            return;
        }
        
        setLoading(true);
        try {
            const response = await emailService.sendAppointmentReminder(
                patient.patientId,
                appointmentDetails.doctorName,
                appointmentDetails.date,
                appointmentDetails.time
            );
            setMessage({ type: 'success', text: response.data || '✅ Appointment reminder sent!' });
            setShowAppointmentModal(false);
            setAppointmentDetails({ doctorName: '', date: '', time: '' });
        } catch (error) {
            setMessage({ type: 'error', text: '❌ Failed to send email' });
        }
        setLoading(false);
        setTimeout(() => setMessage(''), 5000);
    };

    const handleSendMedicineReminder = async () => {
        setLoading(true);
        try {
            const response = await emailService.sendMedicineReminder(patient.patientId);
            setMessage({ type: 'success', text: response.data || '✅ Medicine reminder sent!' });
        } catch (error) {
            setMessage({ type: 'error', text: '❌ Failed to send email' });
        }
        setLoading(false);
        setTimeout(() => setMessage(''), 5000);
    };

    return (
        <div className="email-notification">
            <div className="email-header">
                <h3>📧 Email Notifications</h3>
                <span className="patient-email">To: {patient.email}</span>
            </div>

            {message && (
                <div className={`email-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="email-buttons">
                <button 
                    className="email-btn summary"
                    onClick={handleSendSummary}
                    disabled={loading}
                >
                    📄 Send Discharge Summary
                </button>

                <button 
                    className="email-btn payment"
                    onClick={handleSendPaymentReminder}
                    disabled={loading}
                >
                    💰 Send Payment Reminder
                </button>

                <button 
                    className="email-btn appointment"
                    onClick={() => setShowAppointmentModal(true)}
                    disabled={loading}
                >
                    📅 Send Appointment Reminder
                </button>

                <button 
                    className="email-btn medicine"
                    onClick={handleSendMedicineReminder}
                    disabled={loading}
                >
                    💊 Send Medicine Reminder
                </button>
            </div>

            {/* Appointment Modal */}
            {showAppointmentModal && (
                <div className="appointment-modal">
                    <div className="modal-content">
                        <h4>📅 Appointment Details</h4>
                        <input
                            type="text"
                            placeholder="Doctor Name"
                            value={appointmentDetails.doctorName}
                            onChange={(e) => setAppointmentDetails({
                                ...appointmentDetails, 
                                doctorName: e.target.value
                            })}
                        />
                        <input
                            type="date"
                            value={appointmentDetails.date}
                            onChange={(e) => setAppointmentDetails({
                                ...appointmentDetails, 
                                date: e.target.value
                            })}
                        />
                        <input
                            type="time"
                            value={appointmentDetails.time}
                            onChange={(e) => setAppointmentDetails({
                                ...appointmentDetails, 
                                time: e.target.value
                            })}
                        />
                        <div className="modal-actions">
                            <button onClick={handleSendAppointmentReminder} disabled={loading}>
                                {loading ? 'Sending...' : 'Send Email'}
                            </button>
                            <button onClick={() => setShowAppointmentModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailNotifications;