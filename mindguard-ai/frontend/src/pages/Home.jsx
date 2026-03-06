import { Link, useNavigate } from 'react-router-dom';
import { Shield, Brain, Activity } from 'lucide-react';
import { useEffect } from 'react';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        const currentPath = window.location.pathname;

        // ONLY redirect if the user is literally sitting on the root home page
        if (currentPath === '/') {
            if (role === 'college_admin_dkte') {
                navigate('/admin/dkte', { replace: true });
            } else if (role === 'college_admin_sharad') {
                navigate('/admin/sharad', { replace: true });
            }
        }
    }, [navigate]);
    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '4rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
                    Your Personal <br /> <span style={{ color: 'var(--secondary)' }}>Psychological Readiness</span> Guardian
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    MindGuard AI evaluates your emotional well-being and provides real-time mental health first-aid through advanced sentiment analysis.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '4rem' }}>
                <Link to="/screening" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                    <Brain size={20} />
                    Start Screening
                </Link>
                <Link to="/dashboard" className="btn btn-glass" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                    View Dashboard
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%' }}>
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
                    <div style={{ background: 'rgba(236, 72, 153, 0.2)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <Activity color="var(--secondary)" size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Readiness Score</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Get an instant assessment of your current stress and readiness levels.</p>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
                    <div style={{ background: 'rgba(79, 70, 229, 0.2)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <Shield color="var(--primary)" size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Real-time Intervention</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Chat with our AI First-Aid bot for immediate stabilization during distress.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
