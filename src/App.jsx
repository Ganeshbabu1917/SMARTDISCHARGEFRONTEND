import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import PatientDashboard from './components/PatientDashboard';
import { authService } from './services/authApi';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showLogin, setShowLogin] = useState(true);

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                console.log("🔍 USER FROM STORAGE:", parsedUser);
                setCurrentUser(parsedUser);
                setIsLoggedIn(true);
            } catch (e) {
                console.error("Error parsing user:", e);
                localStorage.removeItem('currentUser');
            }
        }
    }, []);

    const handleLogin = (status) => {
        setIsLoggedIn(status);
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                console.log("✅ Logged in user:", user);
                setCurrentUser(user);
            } catch (e) {
                console.error("Error parsing user on login:", e);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setIsLoggedIn(false);
        setCurrentUser(null);
    };

    if (!isLoggedIn) {
        return showLogin ? (
            <Login 
                onLogin={handleLogin}
                onSwitchToSignup={() => setShowLogin(false)}
            />
        ) : (
            <Signup 
                onSwitchToLogin={() => setShowLogin(true)}
            />
        );
    }

    // Check role and route accordingly
    console.log("👤 CURRENT USER ROLE:", currentUser?.role);
    
    // If role is admin or doctor, show Admin Dashboard
    if (currentUser?.role === 'admin' || currentUser?.role === 'doctor') {
        console.log("➡️ SHOWING ADMIN DASHBOARD");
        return <Dashboard user={currentUser} onLogout={handleLogout} />;
    } 
    // Otherwise show Patient Dashboard
    else {
        console.log("➡️ SHOWING PATIENT DASHBOARD");
        return <PatientDashboard user={currentUser} onLogout={handleLogout} />;
    }
}

export default App;