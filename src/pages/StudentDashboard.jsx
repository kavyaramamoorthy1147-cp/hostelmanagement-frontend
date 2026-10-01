import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import ComplaintForm from '../components/ComplaintForm';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import {
  BedDouble,
  AlertCircle,
  CheckCircle,
  PlusCircle,
  User,
  Phone,
  BookOpen,
  Calendar,
  Building,
  Home
} from 'lucide-react';

const StudentDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState('');

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      await refreshUser();
      const res = await api.get('/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleCreateComplaint = async (formData) => {
    try {
      setSubmitting(true);
      await api.post('/complaints', formData);
      setIsComplaintModalOpen(false);
      setNotification('Your complaint has been submitted to hostel management.');
      setTimeout(() => setNotification(''), 4000);
      fetchStudentData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Student Portal" />

        <div className="page-content">
          {/* Welcome Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
              color: 'white',
              padding: '28px 32px',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div>
              <h1 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '6px' }}>
                Welcome back, {user?.name}!
              </h1>
              <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                Department of {user?.department || 'General Studies'} • {user?.year || '1st Year'}
              </p>
            </div>
            <button
              className="btn"
              style={{
                backgroundColor: 'white',
                color: '#1e3a8a',
                fontWeight: 700
              }}
              onClick={() => setIsComplaintModalOpen(true)}
            >
              <PlusCircle size={18} />
              <span>Submit Complaint</span>
            </button>
          </div>

          {notification && (
            <div className="alert alert-success">
              <CheckCircle size={18} />
              <span>{notification}</span>
            </div>
          )}

          {/* Top Quick Stats */}
          <div className="stats-grid">
            <StatCard
              title="Total Complaints"
              value={complaints.length}
              icon={AlertCircle}
              colorTheme="blue"
            />
            <StatCard
              title="Pending Issues"
              value={pendingCount}
              icon={AlertCircle}
              colorTheme="amber"
            />
            <StatCard
              title="In Progress"
              value={inProgressCount}
              icon={ClockIcon}
              colorTheme="purple"
            />
            <StatCard
              title="Resolved"
              value={resolvedCount}
              icon={CheckCircle}
              colorTheme="green"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Assigned Room Information Card */}
            <div className="card">
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Home size={20} color="var(--primary)" />
                  <h3 className="card-title">My Room Details</h3>
                </div>
                {user?.room && (
                  <span className="badge badge-available">Allocated</span>
                )}
              </div>

              {user?.room ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Room Number</span>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
                      Room {user.room.roomNumber}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Hostel Block</span>
                    <strong>{user.room.block}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Floor</span>
                    <strong>Floor {user.room.floor}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Room Status / Capacity</span>
                    <span>
                      <span className="badge badge-progress">
                        {user.room.occupiedBeds} / {user.room.capacity} Beds Occupied
                      </span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="empty-state" style={{ padding: '30px 10px' }}>
                  <BedDouble className="empty-state-icon" />
                  <h3>No Room Assigned Yet</h3>
                  <p>
                    You have not been assigned to a hostel room yet. Please contact the hostel warden or administrator.
                  </p>
                </div>
              )}
            </div>

            {/* Profile Summary Card */}
            <div className="card">
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={20} color="var(--primary)" />
                  <h3 className="card-title">Student Profile Summary</h3>
                </div>
                <Link to="/profile" className="btn btn-secondary btn-sm">
                  Full Profile
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Student Name</span>
                  <strong>{user?.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Registered Email</span>
                  <strong>{user?.email}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Contact Phone</span>
                  <strong>{user?.phone || 'Not provided'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Gender</span>
                  <strong>{user?.gender || 'Not specified'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Complaints Table */}
          <div className="card" style={{ marginTop: '24px' }}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={20} color="var(--primary)" />
                <h3 className="card-title">My Recent Complaints</h3>
              </div>
              <Link to="/complaints" className="btn btn-secondary btn-sm">
                View All
              </Link>
            </div>

            {loading ? (
              <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading your complaints...
              </p>
            ) : complaints.length === 0 ? (
              <div className="empty-state">
                <CheckCircle className="empty-state-icon" style={{ color: '#10b981' }} />
                <h3>No Complaints Filed</h3>
                <p>You haven't reported any room or hostel issues yet.</p>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: '14px' }}
                  onClick={() => setIsComplaintModalOpen(true)}
                >
                  <PlusCircle size={16} />
                  <span>Report an Issue</span>
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Submitted Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.slice(0, 5).map((c) => (
                      <tr key={c._id}>
                        <td style={{ fontWeight: 600 }}>{c.title}</td>
                        <td style={{ color: 'var(--text-muted)', maxWidth: '350px' }}>
                          {c.description}
                        </td>
                        <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              c.status === 'Resolved'
                                ? 'badge-resolved'
                                : c.status === 'In Progress'
                                ? 'badge-progress'
                                : 'badge-pending'
                            }`}
                          >
                            {c.status}
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
      </div>

      {/* Complaint Submission Modal */}
      <Modal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        title="Submit a New Hostel Complaint"
      >
        <ComplaintForm
          onSubmit={handleCreateComplaint}
          onCancel={() => setIsComplaintModalOpen(false)}
          isSubmitting={submitting}
        />
      </Modal>
    </div>
  );
};

// Simple Clock Icon helper
const ClockIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default StudentDashboard;
