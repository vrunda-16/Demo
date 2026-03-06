import { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Loader } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const timestamp = new Date().getTime(); // Cache buster
                const res = await axios.get(`http://localhost:8000/auth/me?t=${timestamp}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserData(res.data);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const getRiskColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'critical': return 'var(--danger)';
            case 'moderate': return 'var(--warning)';
            default: return 'var(--success)';
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Loader className="animate-spin" size={48} color="var(--primary)" />
            </div>
        );
    }

    if (!userData) {
        return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Error loading dashboard.</div>;
    }

    return (
        <div className="animate-slide-up" style={{ marginTop: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Overview Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, {userData.name}. Here's your mental health summary.</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                        {/* Circular Progress (simplified) */}
                        <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="10" strokeDasharray="283" strokeDashoffset={`${283 - (283 * userData.readiness_score) / 100}`} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{userData.readiness_score}%</span>
                        </div>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Readiness Score</h3>
                        <p style={{ fontSize: '0.9rem' }}>Based on your recent screening.</p>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ background: `${getRiskColor(userData.risk_level)}33`, padding: '1rem', borderRadius: '12px' }}>
                            <ShieldAlert color={getRiskColor(userData.risk_level)} size={32} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Risk Level</h3>
                            <p style={{ fontSize: '2rem', fontWeight: 700, color: getRiskColor(userData.risk_level) }}>{userData.risk_level}</p>
                        </div>
                    </div>
                    {userData.risk_level === 'Critical' && (
                        <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--danger)', fontSize: '0.9rem' }}>
                            Immediate intervention recommended. Please see the chatbot or contact support.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
