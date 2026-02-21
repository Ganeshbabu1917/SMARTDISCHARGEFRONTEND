import React from 'react';
import './PatientDetails.css';

const PatientDetails = ({ patient }) => {
    if (!patient) return null;

    return (
        <div className="patient-details">
            <h2>📋 Patient Information</h2>
            <div className="details-grid">
                <div className="detail-item">
                    <span className="label">Name:</span>
                    <span className="value">{patient.name}</span>
                </div>
                <div className="detail-item">
                    <span className="label">Age/Gender:</span>
                    <span className="value">{patient.age} / {patient.gender}</span>
                </div>
                <div className="detail-item">
                    <span className="label">Patient ID:</span>
                    <span className="value">{patient.patientId}</span>
                </div>
                <div className="detail-item">
                    <span className="label">Diagnosis:</span>
                    <span className="value diagnosis">{patient.diagnosis}</span>
                </div>
                <div className="detail-item">
                    <span className="label">Admission Date:</span>
                    <span className="value">{patient.admissionDate}</span>
                </div>
                <div className="detail-item">
                    <span className="label">Discharge Date:</span>
                    <span className="value">{patient.dischargeDate || 'Not discharged'}</span>
                </div>
            </div>
            
            <div className="vitals-section">
                <h3>Vital Signs</h3>
                <p>{patient.vitals}</p>
            </div>
            
            <div className="medications-section">
                <h3>Current Medications</h3>
                <p>{patient.medications}</p>
            </div>
        </div>
    );
};

export default PatientDetails;