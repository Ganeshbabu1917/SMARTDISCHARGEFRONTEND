const API_BASE_URL = 'http://localhost:8086/api';

export const chatService = {
    // Send a message
    sendMessage: async (messageData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/chat/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },
    
    // Get messages for a patient
    getPatientMessages: async (patientId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/chat/patient/${patientId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    },
    
    // Get all conversations for admin
    getAdminConversations: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/chat/admin/conversations`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching conversations:', error);
            throw error;
        }
    },
    
    // Get conversation with specific patient
    getPatientConversation: async (patientId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/chat/admin/patient/${patientId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching conversation:', error);
            throw error;
        }
    },
    
    // Get unread count
    getUnreadCount: async (adminId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/chat/admin/unread/${adminId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching unread count:', error);
            throw error;
        }
    }
};