import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import api from '../api/axiosInstance';
import {
  Users,
  BedDouble,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  PlusCircle,
  Building,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRooms: 0,
    availableRooms: 0,
    pendingComplaints: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, complaintsRes] = await Promise.all([
        api.get('/rooms/dashboard/stats'),
        api.get('/complaints')
      ]);

      setStats(statsRes.data);
      setRecentComplaints(complaintsRes.data.slice(0, 5)); // top 5
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await api.put(`/complaints/${complaintId}`, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert('Could not update complaint status');
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Admin Dashboard" />

        <div className="page-content">
          <div className="page-header">
            <div className="page-header-info">
              <h1>Hostel Administration Overview</h1>
              <p>Monitor student allocations, room capacities, and resident grievances</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/students" className="btn btn-primary btn-sm">
                <PlusCircle size={16} />
                <span>Manage Students</span>
              </Link>
              <Link to="/rooms" className="btn btn-secondary btn-sm">
                <Building size={16} />
                <span>Manage Rooms</span>
              </Link>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Stats Cards Row */}
          <div className="stats-grid">
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              icon={Users}
              colorTheme="blue"
            />
            <StatCard
              title="Total Rooms"
              value={stats.totalRooms}
              icon={Building}
              colorTheme="purple"
            />
            <StatCard
              title="Available Rooms"
              value={stats.availableRooms}
              icon={CheckCircle}
              colorTheme="green"
            />
            <StatCard
              title="Pending Complaints"
              value={stats.pendingComplaints}
              icon={AlertCircle}
              colorTheme="amber"
            />
          </div>

          {/* Recent Complaints Table */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} color="var(--primary)" />
                <h3 className="card-title">Recent Student Complaints</h3>
              </div>
              <Link
                to="/complaints"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  textDecoration: 'none'
                }}
              >
                <span>View All Complaints</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {loading ? (
              <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading complaints data...
              </p>
            ) : recentComplaints.length === 0 ? (
              <div className="empty-state">
                <CheckCircle className="empty-state-icon" style={{ color: '#10b981' }} />
                <h3>No pending issues</h3>
                <p>All complaints are currently resolved or none have been submitted yet.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Room</th>
                      <th>Issue Title</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Quick Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentComplaints.map((c) => (
                      <tr key={c._id}>
                        <td>
                          <strong>{c.student?.name || 'Unknown Student'}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {c.student?.email}
                          </div>
                        </td>
                        <td>
                          {c.student?.room ? (
                            <span className="badge badge-progress">
                              Room {c.student.room.roomNumber} ({c.student.room.block})
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{c.title}</div>
                          <div
                            style={{
                              fontSize: '0.8rem',
                              color: 'var(--text-muted)',
                              maxWidth: '300px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {c.description}
                          </div>
                        </td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
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
                        <td>
                          <select
                            className="form-control"
                            style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}
                            value={c.status}
                            onChange={(e) => handleStatusChange(c._id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
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
    </div>
  );
};

export default AdminDashboard;
