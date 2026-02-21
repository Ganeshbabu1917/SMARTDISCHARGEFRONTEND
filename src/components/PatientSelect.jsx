import React, { useState, useEffect } from 'react';
import { patientService } from '../services/api';
import './PatientSelect.css';

const PatientSelect = ({ onPatientSelect }) => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        setLoading(true);
        try {
            const response = await patientService.getAllPatients();
            setPatients(response.data);
        } catch (error) {
            console.error('Error loading patients:', error);
        }
        setLoading(false);
    };

    const handleSelect = (e) => {
        setSelectedPatient(e.target.value);
    };

    const handleLoadPatient = () => {
        if (selectedPatient) {
            onPatientSelect(selectedPatient);
        }
    };

    return (
        <div className="patient-select-container">
            <h2>👤 Select Patient</h2>
            <div className="select-group">
                <select 
                    value={selectedPatient} 
                    onChange={handleSelect}
                    className="patient-dropdown"
                >
                    <option value="">-- Select Patient ID --</option>
                    {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                            {patient.id} - {patient.name}
                        </option>
                    ))}
                </select>
                <button 
                    onClick={handleLoadPatient} 
                    disabled={!selectedPatient || loading}
                    className="btn-primary"
                >
                    {loading ? 'Loading...' : 'Load Patient'}
                </button>
            </div>
        </div>
    );
};

export default PatientSelect;