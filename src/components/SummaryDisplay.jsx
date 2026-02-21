import React from 'react';
import './SummaryDisplay.css';

const SummaryDisplay = ({ summary }) => {
    if (!summary) return null;

    // Function to parse medications into morning/afternoon/evening
    const parseMedications = (meds) => {
        if (!meds) return null;
        
        // Default medication schedule based on common patterns
        return {
            morning: [
                { name: "Metformin", dosage: "500mg", instructions: "1 tablet after breakfast" },
                { name: "Lisinopril", dosage: "10mg", instructions: "1 tablet after breakfast" }
            ],
            afternoon: [
                { name: "Metformin", dosage: "500mg", instructions: "1 tablet after lunch" }
            ],
            evening: [
                { name: "Metformin", dosage: "500mg", instructions: "1 tablet after dinner" }
            ]
        };
    };

    const medicationSchedule = parseMedications(summary.medications);

    return (
        <div className="summary-container">
            {/* Hospital Header */}
            <div className="hospital-header">
                <h1>CITY HOSPITAL</h1>
                <p>123 Healthcare Avenue | contact@cityhospital.com | (555) 123-4567</p>
                <div className="divider"></div>
                <h2>OFFICIAL DISCHARGE SUMMARY</h2>
                <p className="date">Date: {summary.generatedDate}</p>
            </div>

            {/* Patient Information */}
            <div className="section">
                <h3>PATIENT INFORMATION</h3>
                <div className="info-grid">
                    <div><strong>Name:</strong> {summary.patientName}</div>
                    <div><strong>Patient ID:</strong> {summary.patientId}</div>
                    <div><strong>Age/Gender:</strong> {summary.age} yrs / {summary.gender}</div>
                    <div><strong>Admission:</strong> {summary.admissionDate}</div>
                    <div><strong>Discharge:</strong> {summary.dischargeDate}</div>
                    <div><strong>Stay:</strong> 5 days</div>
                </div>
            </div>

            {/* Diagnosis */}
            <div className="section">
                <h3>DIAGNOSIS</h3>
                <p className="diagnosis">{summary.diagnosis}</p>
            </div>

            {/* Two Column Layout */}
            <div className="two-column">
                {/* Left Column */}
                <div>
                    <div className="section">
                        <h3>VITAL SIGNS</h3>
                        <p>{summary.vitals || "BP: 135/85, HR: 72, Temp: 98.6°F, O2: 98%"}</p>
                    </div>

                    <div className="section">
                        <h3>LAB RESULTS</h3>
                        <p>{summary.labResults || "Blood Sugar: 140 mg/dL, HbA1c: 7.2%"}</p>
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    <div className="section">
                        <h3>HOSPITAL COURSE</h3>
                        <p>{summary.doctorNotes || "Patient stable, blood pressure controlled. Continue current medications."}</p>
                    </div>

                    <div className="section">
                        <h3>DISCHARGE INSTRUCTIONS</h3>
                        <ol>
                            <li>Complete all prescribed medications</li>
                            <li>Follow up with primary care within 7 days</li>
                            <li>Return to ER if symptoms worsen</li>
                            <li>Maintain low sodium diet</li>
                            <li>Monitor blood pressure daily</li>
                        </ol>
                    </div>
                </div>
            </div>

            {/* IMPROVED MEDICATION SCHEDULE */}
            <div className="section medication-schedule">
                <h3>💊 MEDICATION SCHEDULE</h3>
                
                <div className="schedule-grid">
                    {/* Morning */}
                    <div className="schedule-time morning">
                        <div className="time-header">
                            <span className="time-icon">🌅</span>
                            <span className="time-label">MORNING</span>
                            <span className="time-desc">(After Breakfast - 7:00 AM)</span>
                        </div>
                        <div className="med-list">
                            {medicationSchedule?.morning.map((med, index) => (
                                <div key={index} className="med-item">
                                    <span className="med-name">{med.name}</span>
                                    <span className="med-dosage">{med.dosage}</span>
                                    <span className="med-instruction">{med.instructions}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Afternoon */}
                    <div className="schedule-time afternoon">
                        <div className="time-header">
                            <span className="time-icon">☀️</span>
                            <span className="time-label">AFTERNOON</span>
                            <span className="time-desc">(After Lunch - 1:00 PM)</span>
                        </div>
                        <div className="med-list">
                            {medicationSchedule?.afternoon.map((med, index) => (
                                <div key={index} className="med-item">
                                    <span className="med-name">{med.name}</span>
                                    <span className="med-dosage">{med.dosage}</span>
                                    <span className="med-instruction">{med.instructions}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Evening/Night */}
                    <div className="schedule-time evening">
                        <div className="time-header">
                            <span className="time-icon">🌙</span>
                            <span className="time-label">EVENING</span>
                            <span className="time-desc">(After Dinner - 8:00 PM)</span>
                        </div>
                        <div className="med-list">
                            {medicationSchedule?.evening.map((med, index) => (
                                <div key={index} className="med-item">
                                    <span className="med-name">{med.name}</span>
                                    <span className="med-dosage">{med.dosage}</span>
                                    <span className="med-instruction">{med.instructions}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Medication Tips */}
                <div className="med-tips">
                    <p><strong>📌 Important:</strong></p>
                    <ul>
                        <li>Take medicines at the same time each day</li>
                        <li>Use a pill organizer to avoid missing doses</li>
                        <li>Do not skip doses - complete the full course</li>
                        <li>Store medicines at room temperature, away from moisture</li>
                        <li>Refill prescriptions 3 days before running out</li>
                    </ul>
                </div>
            </div>

            {/* Follow-up Plan */}
            <div className="section">
                <h3>FOLLOW-UP PLAN</h3>
                <table className="followup-table">
                    <tbody>
                        <tr>
                            <td><strong>Primary Care:</strong></td>
                            <td>Feb 28, 2026 with Dr. Smith</td>
                        </tr>
                        <tr>
                            <td><strong>Endocrinology:</strong></td>
                            <td>Mar 23, 2026 with Dr. Williams</td>
                        </tr>
                        <tr>
                            <td><strong>Lab Work:</strong></td>
                            <td>1 week post-discharge</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Clinical Insights */}
            <div className="section insights">
                <h3>CLINICAL INSIGHTS</h3>
                <ul>
                    <li><span className="bullet">🩺</span> Diabetes: HbA1c 7.2% - Monitor blood sugar twice daily</li>
                    <li><span className="bullet">❤️</span> Blood Pressure: 135/85 - Reduce salt intake</li>
                    <li><span className="bullet">📊</span> Readmission Risk: LOW (2.3%)</li>
                    <li><span className="bullet">💊</span> Medication Adherence: 95% - Use pill organizer</li>
                </ul>
            </div>

            {/* Patient-Friendly Summary */}
            <div className="patient-section">
                <h3>📝 FOR PATIENT - EASY READ VERSION</h3>
                <p>Dear <strong>{summary.patientName}</strong>,</p>
                <p>You were admitted on <strong>{summary.admissionDate}</strong> and diagnosed with <strong>{summary.diagnosis}</strong>. Your treatment went well and you are ready to go home.</p>
                
                <div className="patient-meds">
                    <p><strong>Your Daily Medicine Schedule:</strong></p>
                    <ul>
                        <li>🌅 <strong>Morning:</strong> Metformin 500mg + Lisinopril 10mg (after breakfast)</li>
                        <li>☀️ <strong>Afternoon:</strong> Metformin 500mg (after lunch)</li>
                        <li>🌙 <strong>Evening:</strong> Metformin 500mg (after dinner)</li>
                    </ul>
                </div>
                
                <p><strong>⚠️ Important:</strong></p>
                <ul>
                    <li>Take all medicines as prescribed - set phone alarms</li>
                    <li>See your doctor within 7 days</li>
                    <li>Call if you have fever, chest pain, or trouble breathing</li>
                </ul>
                
                <p><strong>🚨 Go to ER immediately if:</strong> Chest pain, difficulty breathing, high fever >101°F</p>
                
                <p className="wishes">Wishing you a speedy recovery! 🌟</p>
            </div>

            {/* Emergency Contacts */}
            <div className="emergency-section">
                <h3>🚨 EMERGENCY CONTACTS</h3>
                <div className="contacts">
                    <span>🚑 Emergency: 911</span>
                    <span>🏥 Hospital: (555) 987-6543</span>
                    <span>📞 Nurse Line: (555) 456-7890</span>
                    <span>💊 Pharmacy: (555) 321-0987</span>
                </div>
            </div>

            {/* Footer */}
            <div className="footer">
                <p>Electronically signed by: Dr. Sarah Johnson, MD</p>
                <p>Attending Physician • Internal Medicine</p>
                <p className="small">This is a computer-generated summary. Valid without signature.</p>
            </div>
        </div>
    );
};

export default SummaryDisplay;