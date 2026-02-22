
const API_BASE_URL = 'http://ec2-13-203-67-191.ap-south-1.compute.amazonaws.com:8086/api';
export const emailService = {
    // 1. Send discharge summary
    sendDischargeSummary: async (patientId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/email/send-summary/${patientId}`, {
                method: 'POST'
            });
            const text = await response.text();
            return { status: response.status, data: text };
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },
    
    // 2. Send payment reminder
    sendPaymentReminder: async (patientId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/email/send-payment/${patientId}`, {
                method: 'POST'
            });
            const text = await response.text();
            return { status: response.status, data: text };
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },
    
    // 3. Send appointment reminder
    sendAppointmentReminder: async (patientId, doctor, date, time) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/email/send-appointment/${patientId}?doctor=${doctor}&date=${date}&time=${time}`,
                { method: 'POST' }
            );
            const text = await response.text();
            return { status: response.status, data: text };
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },
    
    // 4. Send medicine reminder
    sendMedicineReminder: async (patientId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/email/send-medicine/${patientId}`, {
                method: 'POST'
            });
            const text = await response.text();
            return { status: response.status, data: text };
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
};
