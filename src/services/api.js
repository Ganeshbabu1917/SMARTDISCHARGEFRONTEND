const API_BASE_URL = 'http://ec2-13-203-67-191.ap-south-1.compute.amazonaws.com:8086/api'; // Your backend port

export const patientService = {
    // GET all patients
    getAllPatients: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/patients`);
            if (!response.ok) {
                throw new Error('Failed to fetch patients');
            }
            const data = await response.json();
            return { data };
        } catch (error) {
            console.error('Error fetching patients:', error);
            throw error;
        }
    },
    
    // GET patient by ID
    getPatient: async (patientId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/patients/${patientId}`);
            if (!response.ok) {
                throw new Error('Patient not found');
            }
            const data = await response.json();
            return { data };
        } catch (error) {
            console.error('Error fetching patient:', error);
            throw error;
        }
    },
    
    // POST - Add new patient
    addPatient: async (patientData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/patients/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(patientData)
            });
            
            const data = await response.json();
            return { status: response.status, data };
        } catch (error) {
            console.error('Error adding patient:', error);
            throw error;
        }
    },
    
    // GET - Generate discharge summary
    generateSummary: async (patientId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/generate-summary/${patientId}`);
            if (!response.ok) {
                throw new Error('Failed to generate summary');
            }
            const data = await response.json();
            return { data };
        } catch (error) {
            console.error('Error generating summary:', error);
            throw error;
        }
    },
    
    // GET - Export PDF
    exportPDF: (patientId) => `${API_BASE_URL}/export-pdf/${patientId}`
};
