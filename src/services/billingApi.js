
const API_BASE_URL = 'http://ec2-13-203-67-191.ap-south-1.compute.amazonaws.com:8086/api';
export const billingService = {
    // Get billing by patient ID
    getBillingByPatientId: async (patientId) => {
        try {
            console.log('Fetching billing for:', patientId);
            const response = await fetch(`${API_BASE_URL}/billing/patient/${patientId}`);
            const data = await response.json();
            return { status: response.status, data };
        } catch (error) {
            console.error('Error fetching billing:', error);
            throw error;
        }
    },
    
    // Create new billing
    createBilling: async (billingData) => {
        try {
            console.log('Creating billing:', billingData);
            const response = await fetch(`${API_BASE_URL}/billing/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(billingData)
            });
            const data = await response.json();
            return { status: response.status, data };
        } catch (error) {
            console.error('Error creating billing:', error);
            throw error;
        }
    },
    
    // Update billing
    updateBilling: async (patientId, billingData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/billing/update/${patientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(billingData)
            });
            const data = await response.json();
            return { status: response.status, data };
        } catch (error) {
            console.error('Error updating billing:', error);
            throw error;
        }
    }
};
