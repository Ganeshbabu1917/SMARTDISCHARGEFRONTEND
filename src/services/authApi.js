const API_BASE_URL = 'http://ec2-13-126-142-30.ap-south-1.compute.amazonaws.com:8086/api';

export const authService = {
    // Sign up new user with ALL patient details
    signup: async (userData) => {
        try {
            console.log('📤 Sending signup with data:', userData);
            
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)  // Send ALL fields at once
            });
            
            const data = await response.json();
            console.log('📨 Signup response:', { status: response.status, data });
            return { status: response.status, data };
        } catch (error) {
            console.error('❌ Signup error:', error);
            throw error;
        }
    },
    
    // Login user
    login: async (email, password) => {
        try {
            console.log('📤 Sending login for:', email);
            
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            console.log('📨 Login response:', { status: response.status, data });
            
            // If login successful, store user in localStorage
            if (response.status === 200) {
                localStorage.setItem('currentUser', JSON.stringify(data));
            }
            
            return { status: response.status, data };
        } catch (error) {
            console.error('❌ Login error:', error);
            throw error;
        }
    },
    
    // Logout user
    logout: () => {
        localStorage.removeItem('currentUser');
        console.log('👋 User logged out');
    },
    
    // Get current user from localStorage
    getCurrentUser: () => {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                console.error('Error parsing user:', e);
                return null;
            }
        }
        return null;
    },
    
    // Check if user is logged in
    isLoggedIn: () => {
        return localStorage.getItem('currentUser') !== null;
    },
    
    // Test connection
    test: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/test`);
            const data = await response.text();
            console.log('✅ Test connection successful:', data);
            return data;
        } catch (error) {
            console.error('❌ Test error:', error);
            throw error;
        }
    }
};
