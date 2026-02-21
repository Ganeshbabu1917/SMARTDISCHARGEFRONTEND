import React, { useState, useEffect } from 'react';
import { billingService } from '../services/billingApi';
import './BillingCard.css';

const BillingCard = ({ patient, onUpdate }) => {
    const [billing, setBilling] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');

    useEffect(() => {
        if (patient) {
            loadBilling();
        }
    }, [patient]);

    const loadBilling = async () => {
        setLoading(true);
        setError('');
        try {
            console.log('Loading billing for patient:', patient.patientId);
            const response = await billingService.getBillingByPatientId(patient.patientId);
            console.log('Billing response:', response);
            
            if (response.status === 200) {
                setBilling(response.data);
            } else {
                setBilling(null);
            }
        } catch (error) {
            console.error('Error loading billing:', error);
            setError('Failed to load billing');
        }
        setLoading(false);
    };

    const handleCreateBilling = async () => {
        setLoading(true);
        setError('');
        try {
            const newBilling = {
                patientId: patient.patientId,
                patientName: patient.name,
                admissionFees: 500,
                doctorFees: 1000,
                medicineFees: 0,
                labFees: 0,
                roomFees: 0,
                otherFees: 0,
                paidAmount: 0
            };
            
            console.log('Creating billing:', newBilling);
            const response = await billingService.createBilling(newBilling);
            console.log('Create response:', response);
            
            if (response.status === 201) {
                await loadBilling();
                if (onUpdate) onUpdate();
            } else {
                setError(response.data?.message || 'Failed to create billing');
            }
        } catch (error) {
            console.error('Error creating billing:', error);
            setError('Connection error');
        }
        setLoading(false);
    };

    const handlePayment = async () => {
        if (!paymentAmount || paymentAmount <= 0) {
            setError('Please enter valid amount');
            return;
        }
        
        setLoading(true);
        setError('');
        try {
            const updatedBilling = {
                ...billing,
                paidAmount: (billing.paidAmount || 0) + parseFloat(paymentAmount)
            };
            
            const response = await billingService.updateBilling(patient.patientId, updatedBilling);
            if (response.status === 200) {
                await loadBilling();
                setShowPaymentModal(false);
                setPaymentAmount('');
                if (onUpdate) onUpdate();
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            setError('Payment failed');
        }
        setLoading(false);
    };

    if (loading) return <div className="billing-loading">Loading billing...</div>;

    if (!billing) {
        return (
            <div className="billing-card no-billing">
                <h3>💰 Billing Information</h3>
                {error && <div className="error-message">{error}</div>}
                <p>No billing record found for this patient.</p>
                <button 
                    className="create-billing-btn"
                    onClick={handleCreateBilling}
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Billing'}
                </button>
            </div>
        );
    }

    return (
        <div className="billing-card">
            <div className="billing-header">
                <h3>💰 Billing Information</h3>
                <span className={`payment-status ${billing.paymentStatus?.toLowerCase()}`}>
                    {billing.paymentStatus}
                </span>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="billing-stats">
                <div className="stat-item">
                    <span className="stat-label">Total</span>
                    <span className="stat-value">₹{billing.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Paid</span>
                    <span className="stat-value paid">₹{billing.paidAmount?.toFixed(2)}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Due</span>
                    <span className="stat-value due">₹{billing.dueAmount?.toFixed(2)}</span>
                </div>
            </div>

            <div className="billing-actions">
                <button 
                    className="pay-btn"
                    onClick={() => setShowPaymentModal(true)}
                    disabled={billing.paymentStatus === 'Paid' || loading}
                >
                    Make Payment
                </button>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="payment-modal">
                    <div className="modal-content">
                        <h4>Make Payment</h4>
                        <p>Due Amount: ₹{billing.dueAmount?.toFixed(2)}</p>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            max={billing.dueAmount}
                        />
                        <div className="modal-actions">
                            <button className="pay-now-btn" onClick={handlePayment} disabled={loading}>
                                {loading ? 'Processing...' : 'Pay Now'}
                            </button>
                            <button className="cancel-btn" onClick={() => setShowPaymentModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingCard;