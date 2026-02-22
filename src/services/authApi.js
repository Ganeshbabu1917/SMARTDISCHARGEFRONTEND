const API_BASE_URL = 'http://ec2-13-203-67-191.ap-south-1.compute.amazonaws.com:8086/api';

export const authService = {
    // Sign up new user with role
    signup: async (name, email, password, role) => {
        try {
            console.log('Sending signup to:', `${API_BASE_URL}/auth/signup`);
            
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role })
            });
            
            const data = await response.json();
            return { status: response.status, data };
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    },
    
    // Login user
    login: async (email, password) => {
        try {
            console.log('Sending login to:', `${API_BASE_URL}/auth/login`);
            
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            return { status: response.status, data };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },
    
    // Test connection
    test: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/test`);
            const data = await response.text();
            return data;
        } catch (error) {
            console.error('Test error:', error);
            throw error;
        }
    }
};
