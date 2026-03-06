import { useState, useEffect } from 'react';
import { Loader, Users, ShieldAlert, Activity } from 'lucide-react';
import axios from 'axios';

const CollegeAdminDKTE = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('token');
                const timestamp = new Date().getTime(); // Cache buster
                const res = await axios.get(`http://localhost:8000/admin/students?college=DKTE%20textile%20and%20Engineering%20Institute&t=${timestamp}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setStudents(res.data);
            } catch (err) {
                console.error("Failed to fetch student data", err);
                setError('Failed to load student data.');
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
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

    if (error) {
        return <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--danger)' }}>{error}</div>;
    }

    return (
        <div className="animate-slide-up" style={{ marginTop: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>DKTE Admin Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Overview of student mental health and stress levels for DKTE Textile and Engineering Institute.</p>
                </div>
                <button onClick={() => window.location.reload()} className="btn btn-glass" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={18} /> Refresh Data
                </button>
            </header>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <Users size={24} color="var(--primary)" />
                    <h2 style={{ fontSize: '1.5rem' }}>Student List</h2>
                    <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                        Total: {students.length}
                    </span>
                </div>

                {students.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '2rem 0' }}>No students found for this college yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                                    <th style={{ padding: '1rem' }}>Name</th>
                                    <th style={{ padding: '1rem' }}>Email</th>
                                    <th style={{ padding: '1rem' }}>Readiness Score</th>
                                    <th style={{ padding: '1rem' }}>Risk Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{student.name}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{student.email}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Activity size={16} color="var(--primary)" />
                                                {student.readiness_score}%
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                color: getRiskColor(student.risk_level),
                                                background: `${getRiskColor(student.risk_level)}22`,
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.85rem',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                <ShieldAlert size={14} />
                                                {student.risk_level}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollegeAdminDKTE;
